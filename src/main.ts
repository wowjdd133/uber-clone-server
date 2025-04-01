import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as session from 'express-session';
import Redis from 'ioredis';
import * as passport from 'passport';
import { RedisStore } from 'connect-redis';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common/pipes';
import { HttpExceptionFilter } from './http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const redisClient = new Redis();
  // redisClient.connect().catch(console.error);
  const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'myapp:',
  });

  //swagger 설정
  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .addCookieAuth('connect.sid')
    .setDescription('NestJS API Description')
    .setVersion('1.0')
    .addTag('nestjs')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalFilters(new HttpExceptionFilter());
  //validation pipe 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(
    session({
      secret: configService.get<string>('SESSION_SECRET')!,
      saveUninitialized: false,
      resave: false,
      store: redisStore,
      cookie: {
        httpOnly: true,
        // secure: true,
        maxAge: 1000 * 60 * 30, // 30분 유지,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(configService.get<string>('PORT') ?? 3000);
  console.log('Server is open on port: ', configService.get<string>('PORT'));
}
bootstrap().catch((err) => console.error(err));

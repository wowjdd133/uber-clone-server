import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as session from 'express-session';
import Redis from 'ioredis';
import * as passport from 'passport';
import { RedisStore } from 'connect-redis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const redisClient = new Redis();
  // redisClient.connect().catch(console.error);

  const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'myapp:',
  });

  app.use(
    session({
      secret: configService.get<string>('SESSION_SECRET')!,
      saveUninitialized: false,
      resave: false,
      store: redisStore,
      cookie: {
        httpOnly: true,
        secure: true,
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

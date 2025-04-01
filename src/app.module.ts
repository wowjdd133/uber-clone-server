import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '@nestjs-modules/ioredis';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    RedisModule.forRoot({
      type: 'single',
      options: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '6379'),
        // password: process.env.REDIS_PASSWORD,
      },
    }),
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: process.env.MYSQL_PASSWORD,
      database: 'test',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      synchronize: true, // Set to false in production
      logging: true, // Enable logging for debugging
      autoLoadEntities: true, // Automatically load entities
      migrationsRun: false, // Automatically run migrations on startup
      ssl: false, // Set to true if using SSL
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

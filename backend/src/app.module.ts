import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import * as dotenv from 'dotenv';
import { AuthModule } from './auth/auth.module';
import { HealthController } from './health/health.controller';
import { ScheduleModule } from '@nestjs/schedule';

dotenv.config();

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'user',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'database',
      autoLoadModels: true,
      synchronize: true
      // logging: false
    }),
    PrometheusModule.register(),
    ScheduleModule.forRoot(),
    AuthModule
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor
    }
  ]
})
export class AppModule {}
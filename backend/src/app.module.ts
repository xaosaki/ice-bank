import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import * as dotenv from 'dotenv';
import { AuthModule } from './auth/auth.module';
import { HealthController } from './health/health.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { AccountsModule } from './accounts/accounts.module';
import { TokenModule } from './common/modules/token/token.module';
import { TransactionsModule } from './transactions/transactions.module';
import { OutgoingSplitsModule } from './outgoing-splits/outgoing-splits.module';
import { IncomingSplitsModule } from './incoming-splits/incoming-splits.module';
import { FriendsModule } from './friends/friends.module';
import { ProfileModule } from './profile/profile.module';
import { EventsModule } from './common/modules/events/events.module';

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
      synchronize: true,
      logging: process.env.ENV !== 'PROD'
    }),
    PrometheusModule.register(),
    ScheduleModule.forRoot(),
    TokenModule,
    AuthModule,
    ProfileModule,
    AccountsModule,
    TransactionsModule,
    OutgoingSplitsModule,
    IncomingSplitsModule,
    FriendsModule,
    EventsModule
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

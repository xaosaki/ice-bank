import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { EventsGateway } from './events.gateway';
import { WsExceptionFilter } from './ws-exception.filter';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRE_TIME }
    })
  ],
  controllers: [],
  providers: [
    EventsGateway,
    {
      provide: APP_FILTER,
      useClass: WsExceptionFilter
    }
  ]
})
export class EventsModule {}

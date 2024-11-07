import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { NotificationMessageDTO } from '../dto/notification-message.dto';

@Injectable()
export class NotificationService {
  private readonly redisPub: Redis;

  constructor() {
    this.redisPub = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10)
    });
  }

  async sendMessage(message: NotificationMessageDTO) {
    const data = JSON.stringify(message);
    await this.redisPub.publish('ice_user_notifications', data);
  }
}

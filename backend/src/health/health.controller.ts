import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

@Controller()
export class HealthController {
  constructor(private readonly sequelize: Sequelize) {}

  @Get('health')
  async getHealthStatus() {
    try {
      await this.sequelize.authenticate();
      return { status: 'ok', message: 'Service and DB are healthy' };
    } catch (_: any) {
      throw new HttpException(
        { status: 'error', message: 'Database connection failed' },
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }
  }

  @Get('ready')
  async getReadyStatus() {
    try {
      await this.sequelize.authenticate();
      const isReady = true;
      return {
        status: isReady ? 'ready' : 'not ready',
        message: isReady ? 'Service is ready' : 'Service is not ready'
      };
    } catch (_: any) {
      throw new HttpException(
        { status: 'error', message: 'Database not ready' },
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }
  }
}

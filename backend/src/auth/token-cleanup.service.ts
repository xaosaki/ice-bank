import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Op } from 'sequelize';
import { BlacklistToken } from '../common/models/blacklist-token.model';

@Injectable()
export class TokenCleanupService {
  private readonly logger = new Logger(TokenCleanupService.name);
  @Cron('0 0 * * *') // Every day — midnight
  async handleCron() {
    const deletedCount = await BlacklistToken.destroy({
      where: { expiresAt: { [Op.lt]: new Date() } }
    });
    this.logger.log(`Expired tokens cleaned up. Deleted: ${deletedCount}`);
  }
}

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OutgoingSplitsService } from './outgoing-splits.service';
import { OutgoingSplitsController } from './outgoing-splits.controller';
import { Split } from '../common/models/split.model';
import { SplitPart } from '../common/models/split-part.model';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { Transaction } from '../common/models/transaction.model';
import { Merchant } from '../common/models/merchant.model';
import { NotificationService } from '../common/services/notification.service';

@Module({
  imports: [SequelizeModule.forFeature([Split, SplitPart, Transaction, Merchant])],
  controllers: [OutgoingSplitsController],
  providers: [JwtStrategy, NotificationService, OutgoingSplitsService],
  exports: [OutgoingSplitsService]
})
export class OutgoingSplitsModule {}

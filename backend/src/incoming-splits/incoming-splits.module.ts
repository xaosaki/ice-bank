import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { IncomingSplitsService } from './incoming-splits.service';
import { IncomingSplitsController } from './incoming-splits.controller';
import { User } from '../common/models/user.model';
import { Split } from '../common/models/split.model';
import { SplitPart } from '../common/models/split-part.model';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { Account } from '../common/models/account.model';
import { Transaction } from '../common/models/transaction.model';
import { Merchant } from '../common/models/merchant.model';
import { S3Service } from '../common/services/s3.service';
import { NotificationService } from '../common/services/notification.service';

@Module({
  imports: [SequelizeModule.forFeature([Split, SplitPart, User, Account, Transaction, Merchant])],
  controllers: [IncomingSplitsController],
  providers: [JwtStrategy, NotificationService, IncomingSplitsService, S3Service]
})
export class IncomingSplitsModule {}

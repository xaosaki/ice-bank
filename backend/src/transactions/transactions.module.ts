import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { Transaction } from '../common/models/transaction.model';
import { Merchant } from '../common/models/merchant.model';
import { Account } from '../common/models/account.model';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { S3Service } from '../common/services/s3.service';
import { Split } from '../common/models/split.model';
import { SplitPart } from '../common/models/split-part.model';

@Module({
  imports: [SequelizeModule.forFeature([Transaction, Merchant, Account, Split, SplitPart])],
  controllers: [TransactionsController],
  providers: [JwtStrategy, TransactionsService, S3Service]
})
export class TransactionsModule {}

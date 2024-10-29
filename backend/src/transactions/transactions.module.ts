import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { Transaction } from '../common/models/transaction.model';
import { Merchant } from '../common/models/merchant.model';
import { Account } from '../common/models/account.model';
import { JwtStrategy } from '../common/strategies/jwt.strategy';

@Module({
  imports: [SequelizeModule.forFeature([Transaction, Merchant, Account])],
  controllers: [TransactionsController],
  providers: [JwtStrategy, TransactionsService]
})
export class TransactionsModule {}

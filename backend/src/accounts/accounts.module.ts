import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { Account } from '../common/models/account.model';
import { User } from '../common/models/user.model';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { Transaction } from '../common/models/transaction.model';
import { Merchant } from '../common/models/merchant.model';

@Module({
  imports: [SequelizeModule.forFeature([User, Account, Transaction, Merchant])],
  controllers: [AccountsController],
  providers: [AccountsService, JwtStrategy]
})
export class AccountsModule {}

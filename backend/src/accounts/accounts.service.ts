import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Account } from '../common/models/account.model';
import { AccountDTO } from './dto/account.dto';
import { Merchant } from '../common/models/merchant.model';
import { Transaction } from '../common/models/transaction.model';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(Account)
    private readonly accountModel: typeof Account,
    @InjectModel(Transaction)
    private readonly transactionModel: typeof Transaction
  ) {}

  async getAccountsByUserId(userId: string): Promise<AccountDTO[]> {
    return this.accountModel
      .findAll({
        where: { userId },
        order: [['name', 'DESC']]
      })
      .then((models) => models.map((model) => new AccountDTO(model)));
  }

  async getAccountTransactions(
    accountId: string,
    userId: string
  ): Promise<(Transaction & { merchant: Merchant | null })[]> {
    await this.validateUserAccount(accountId, userId);

    return (await this.transactionModel.findAll({
      where: { accountId },
      include: [Merchant]
    })) as unknown as Promise<(Transaction & { merchant: Merchant | null })[]>;
  }

  private async validateUserAccount(accountId: string, userId: string): Promise<void> {
    const account = await this.accountModel.findOne({ where: { accountId, userId } });
    if (!account) {
      throw new NotFoundException('Account not found or access denied');
    }
  }
}

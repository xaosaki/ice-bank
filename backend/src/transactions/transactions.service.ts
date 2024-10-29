import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TransactionDTO } from './dto/transaction.dto';
import { Merchant } from '../common/models/merchant.model';
import { Account } from '../common/models/account.model';
import { CreateTransactionDTO } from './dto/create-transaction.dto';
import { Sequelize } from 'sequelize-typescript';
import { Transaction as SeqTransaction } from 'sequelize';
import { Transaction } from '../common/models/transaction.model';

export type TransactionJoined = Transaction & { merchant: Merchant | null } & { account: Account };

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction) private readonly transactionModel: typeof Transaction,
    @InjectModel(Merchant) private readonly merchantModel: typeof Merchant,
    @InjectModel(Account) private readonly accountModel: typeof Account,
    private readonly sequelize: Sequelize
  ) {}

  async createTransaction(dto: CreateTransactionDTO, userId: string): Promise<TransactionDTO> {
    const transaction: SeqTransaction = await this.sequelize.transaction();
    try {
      await this.validateUserAccount(dto.accountId, userId);

      const merchant = await this.findOrCreateMerchant(dto, transaction);

      await this.transactionModel.create(
        {
          ...dto,
          userId,
          merchantId: merchant.merchantId
        },
        {
          transaction
        }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }

    const createdTransaction = (await this.transactionModel.findByPk(dto.transactionId, {
      include: [{ model: Account }, { model: Merchant }]
    })) as TransactionJoined;

    return new TransactionDTO(createdTransaction);
  }

  async getTransactionById(transactionId: string, userId: string): Promise<TransactionDTO | null> {
    const transaction = (await this.transactionModel.findOne({
      where: { transactionId },
      include: [{ model: Account, where: { userId } }, { model: Merchant }]
    })) as TransactionJoined;

    if (!transaction) {
      return null;
    }

    return new TransactionDTO(transaction);
  }

  private async validateUserAccount(accountId: string, userId: string): Promise<void> {
    const account = await this.accountModel.findOne({ where: { accountId, userId } });
    if (!account) {
      throw new NotFoundException('Account not found or access denied');
    }
  }

  private async findOrCreateMerchant(dto: CreateTransactionDTO, transaction: SeqTransaction) {
    let merchant = null;
    if (dto.merchant?.merchantId) {
      merchant = await this.merchantModel.findByPk(dto.merchant.merchantId);
    }
    if (!merchant && dto.merchant) {
      merchant = await this.merchantModel.create(
        {
          merchantId: crypto.randomUUID(),
          name: dto.merchant.name,
          logo: dto.merchant.logo,
          mcc: dto.merchant.mcc
        },
        { transaction }
      );
    }
    return merchant!;
  }
}

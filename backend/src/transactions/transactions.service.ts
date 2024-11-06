import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TransactionDTO } from './dto/transaction.dto';
import { Merchant } from '../common/models/merchant.model';
import { Account } from '../common/models/account.model';
import { CreateTransactionDTO } from './dto/create-transaction.dto';
import { Sequelize } from 'sequelize-typescript';
import { Transaction as SeqTransaction } from 'sequelize';
import { Transaction } from '../common/models/transaction.model';
import * as cryptoNode from 'crypto';
import { S3Service } from '../common/services/s3.service';
import { Split } from '../common/models/split.model';

export type TransactionJoined = Transaction & { merchant: Merchant | null } & { account: Account };

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction) private readonly transactionModel: typeof Transaction,
    @InjectModel(Merchant) private readonly merchantModel: typeof Merchant,
    @InjectModel(Account) private readonly accountModel: typeof Account,
    @InjectModel(Split) private readonly splitModel: typeof Split,
    private readonly sequelize: Sequelize,
    private readonly s3Service: S3Service
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

  async getTransactionById(
    transactionId: string,
    userId: string,
    raw: boolean = false
  ): Promise<TransactionDTO | Transaction | null> {
    const transaction = (await this.transactionModel.findOne({
      where: { transactionId },
      include: [{ model: Account, where: { userId } }, { model: Merchant }]
    })) as TransactionJoined;

    if (!transaction) {
      return null;
    }

    return raw ? transaction : new TransactionDTO(transaction);
  }

  // TODO: think about strict file checking.
  async addReceipt(
    transactionId: string,
    userId: string,
    file: Express.Multer.File
  ): Promise<string> {
    const transaction = (await this.getTransactionById(
      transactionId,
      userId,
      true
    )) as Transaction | null;
    if (!transaction) throw new NotFoundException('Transaction not found or access denied');

    const timestamp = new Date().toISOString();
    const hash = cryptoNode
      .createHash('md5')
      .update(transactionId + timestamp)
      .digest('hex');
    const filename = `receipts/${transactionId}-${hash}.${file.mimetype.split('/')[1]}`;

    const receiptUrl = await this.s3Service.uploadFile(file, filename);
    transaction.receipt = receiptUrl.Key;
    await transaction.save();
    return receiptUrl.Key;
  }

  async removeReceipt(transactionId: string, userId: string): Promise<void> {
    const transaction = (await this.getTransactionById(
      transactionId,
      userId,
      true
    )) as Transaction | null;
    if (!transaction || !transaction.receipt) throw new NotFoundException('Receipt not found');

    const hasSplits =
      (await this.splitModel.count({
        where: { transactionId: transaction.transactionId }
      })) > 0;

    if (!hasSplits) {
      await this.s3Service.deleteFile(transaction.receipt);
    }

    transaction.receipt = null;
    await transaction.save();
  }

  async getReceipt(transactionId: string, userId: string): Promise<any> {
    const transaction = (await this.getTransactionById(
      transactionId,
      userId,
      true
    )) as Transaction | null;
    if (!transaction || !transaction.receipt) throw new NotFoundException('Receipt not found');

    return this.s3Service.getFileStream(transaction.receipt);
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

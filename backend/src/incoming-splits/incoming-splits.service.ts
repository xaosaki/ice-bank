import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../common/models/user.model';
import { IncomingSplitDTO } from './dto/incoming-split.dto';
import { Split } from '../common/models/split.model';
import { SplitPart } from '../common/models/split-part.model';
import { Account } from '../common/models/account.model';
import { Sequelize } from 'sequelize-typescript';
import { S3Service } from '../common/services/s3.service';

@Injectable()
export class IncomingSplitsService {
  constructor(
    @InjectModel(Split) private readonly splitModel: typeof Split,
    @InjectModel(SplitPart) private readonly splitPartModel: typeof SplitPart,
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(Account) private readonly accountModel: typeof Account,
    private readonly sequelize: Sequelize,
    private readonly s3Service: S3Service
  ) {}

  async getIncomingSplits(userId: string) {
    const parts = (await this.splitPartModel.findAll({
      where: { userId },
      include: [Split]
    })) as (SplitPart & { split: Split })[];

    return await Promise.all(
      parts.map(async (part) => {
        const fromUser = (await this.userModel.findByPk(part.split.fromUserId)) as User;
        return new IncomingSplitDTO(part.split, part, fromUser);
      })
    );
  }

  async getIncomingSplitById(splitId: string, userId: string, raw = false) {
    const part = (await this.splitPartModel.findOne({
      where: { splitId, userId },
      include: [Split]
    })) as SplitPart & { split: Split };

    if (!part) {
      throw new NotFoundException('Split not found or does not include the user');
    }

    const fromUser = (await this.userModel.findByPk(part.split.fromUserId)) as User;
    return raw ? part.split : new IncomingSplitDTO(part.split, part, fromUser);
  }

  async processIncomingSplit(
    splitId: string,
    userId: string,
    action: 'accept' | 'decline',
    accountId: string,
    comment?: string
  ) {
    const transaction = await this.sequelize.transaction();

    try {
      const part = await this.splitPartModel.findOne({
        where: { splitId, userId },
        transaction
      });

      if (!part) {
        throw new ForbiddenException('User not authorized to process this split');
      }

      if (part.status !== 'Pending') {
        throw new BadRequestException('Split part is already processed');
      }

      // Payment simulation
      if (action === 'accept') {
        const account = await this.accountModel.findOne({
          where: { accountId, userId },
          transaction,
          lock: transaction.LOCK.UPDATE
        });

        if (!account) {
          throw new ForbiddenException('Account not authorized for this user');
        }

        const split = await this.splitModel.findOne({
          where: { splitId },
          transaction
        });

        if (!split) {
          throw new BadRequestException('Split not found');
        }

        const transactionAmount = Number(part.amount);
        if (Number(account.balance) < transactionAmount) {
          throw new BadRequestException('Insufficient balance');
        }

        await account.update(
          { balance: Number(account.balance) - transactionAmount },
          { transaction }
        );

        const targetAccount = await this.accountModel.findOne({
          where: { accountId: split.accountId },
          transaction,
          lock: transaction.LOCK.UPDATE
        });

        if (!targetAccount) {
          throw new BadRequestException('Target account not found');
        }

        await targetAccount.update(
          { balance: Number(targetAccount.balance) + transactionAmount },
          { transaction }
        );
      }

      await part.update(
        {
          status: action === 'accept' ? 'Accepted' : 'Declined',
          comment
        },
        { transaction }
      );

      const pendingParts = await this.splitPartModel.count({
        where: { splitId, status: 'Pending' },
        transaction
      });

      if (pendingParts === 0) {
        await this.splitModel.update({ status: 'Completed' }, { where: { splitId }, transaction });
      }

      await transaction.commit();
      return { message: 'Split processed successfully' };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getReceipt(splitId: string, userId: string): Promise<any> {
    const split = (await this.getIncomingSplitById(splitId, userId, true)) as Split | null;
    if (!split || !split.receipt) throw new NotFoundException('Receipt not found');

    return this.s3Service.getFileStream(split.receipt);
  }
}

import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateSplitDTO } from './dto/create-split.dto';
import { Split } from '../common/models/split.model';
import { SplitPart } from '../common/models/split-part.model';
import { Transaction } from '../common/models/transaction.model';
import { Sequelize } from 'sequelize-typescript';
import { OutgoingSplitDTO } from './dto/outgoing-split.dto';
import { User } from '../common/models/user.model';

@Injectable()
export class OutgoingSplitsService {
  constructor(
    @InjectModel(Split) private readonly splitModel: typeof Split,
    @InjectModel(SplitPart) private readonly splitPartModel: typeof SplitPart,
    @InjectModel(Transaction) private readonly transactionModel: typeof Transaction,
    private readonly sequelize: Sequelize
  ) {}

  async createSplit(createSplitDto: CreateSplitDTO, userId: string) {
    const transaction = await this.sequelize.transaction();
    const transactionRecord = await this.transactionModel.findOne({
      where: {
        transactionId: createSplitDto.transactionId,
        userId: userId
      }
    });

    if (!transactionRecord) {
      throw new NotFoundException('Transaction not found or does not belong to the user');
    }

    try {
      const split = await this.splitModel.create(
        {
          splitId: createSplitDto.splitId,
          accountId: transactionRecord.accountId,
          transactionId: transactionRecord.transactionId,
          transactionName: transactionRecord.description,
          transactionLogo: transactionRecord.receipt,
          transactionDate: transactionRecord.date,
          amount: createSplitDto.amount,
          receipt: createSplitDto.receipt,
          fromUserId: userId,
          status: 'Pending'
        },
        { transaction }
      );

      const splitParts = createSplitDto.users.map((user) => ({
        partId: crypto.randomUUID(),
        splitId: split.splitId,
        userId: user.userId,
        amount: user.amount,
        status: 'Pending'
      }));

      await this.splitPartModel.bulkCreate(splitParts, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }

    const split = (await this.splitModel.findOne({
      where: { splitId: createSplitDto.splitId },
      include: [
        {
          model: SplitPart,
          include: [
            {
              model: User,
              attributes: ['userId', 'email', 'firstName', 'lastName', 'middleName', 'phone']
            }
          ]
        }
      ]
    })) as Split;

    return new OutgoingSplitDTO(split, split.users);
  }

  async cancelSplit(splitId: string, userId: string) {
    const transaction = await this.sequelize.transaction();
    const split = await this.splitModel.findByPk(splitId);
    if (!split || split.fromUserId !== userId) {
      throw new ForbiddenException('Unauthorized to cancel this split');
    }

    try {
      await this.splitPartModel.update(
        { status: 'Canceled' },
        { where: { splitId, status: 'Pending' }, transaction }
      );

      await split.update({ status: 'Canceled' }, { transaction });

      await transaction.commit();

      return { message: 'Split canceled successfully' };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getSplits(transactionId: string | undefined, userId: string) {
    const whereCondition: any = { fromUserId: userId };

    if (transactionId) {
      whereCondition.transactionId = transactionId;
    }

    const splits = await this.splitModel.findAll({
      where: whereCondition,
      include: [
        {
          model: SplitPart,
          include: [
            {
              model: User,
              attributes: ['userId', 'email', 'firstName', 'lastName', 'middleName', 'phone']
            }
          ]
        }
      ]
    });

    return splits.map((model) => new OutgoingSplitDTO(model, model.users));
  }

  async getSplitById(splitId: string, userId: string) {
    const split = await this.splitModel.findOne({
      where: { splitId, fromUserId: userId },
      include: [
        {
          model: SplitPart,
          include: [
            {
              model: User,
              attributes: ['userId', 'email', 'firstName', 'lastName', 'middleName', 'phone']
            }
          ]
        }
      ]
    });
    if (!split) {
      throw new NotFoundException('Split not found');
    }
    return new OutgoingSplitDTO(split, split.users);
  }
}

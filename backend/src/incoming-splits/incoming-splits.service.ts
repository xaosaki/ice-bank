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

@Injectable()
export class IncomingSplitsService {
  constructor(
    @InjectModel(Split) private readonly splitModel: typeof Split,
    @InjectModel(SplitPart) private readonly splitPartModel: typeof SplitPart,
    @InjectModel(User) private readonly userModel: typeof User
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

  async getIncomingSplitById(splitId: string, userId: string) {
    const part = (await this.splitPartModel.findOne({
      where: { splitId, userId },
      include: [Split]
    })) as SplitPart & { split: Split };

    if (!part) {
      throw new NotFoundException('Split not found or does not include the user');
    }

    const fromUser = (await this.userModel.findByPk(part.split.fromUserId)) as User;
    return new IncomingSplitDTO(part.split, part, fromUser);
  }

  async processIncomingSplit(
    splitId: string,
    userId: string,
    action: 'accept' | 'decline',
    comment?: string
  ) {
    const part = await this.splitPartModel.findOne({
      where: { splitId, userId }
    });

    if (!part) {
      throw new ForbiddenException('User not authorized to process this split');
    }

    if (part.status !== 'Pending') {
      throw new BadRequestException('Split part is already processed');
    }

    await part.update({ status: action === 'accept' ? 'Accepted' : 'Declined', comment });

    const pendingParts = await this.splitPartModel.count({
      where: { splitId, status: 'Pending' }
    });

    // TODO: Replace with a push event that is processed reliably (in the real world)
    if (pendingParts === 0) {
      await this.splitModel.update({ status: 'Completed' }, { where: { splitId } });
    }

    return { message: 'Split processed successfully' };
  }
}

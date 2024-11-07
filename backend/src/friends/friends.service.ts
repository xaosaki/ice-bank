import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../common/models/user.model';
import { FriendDTO } from './dto/friend.dto';
import { Friend } from '../common/models/friend.model';

@Injectable()
export class FriendsService {
  constructor(
    @InjectModel(Friend) private readonly friendModel: typeof Friend,
    @InjectModel(User) private readonly userModel: typeof User
  ) {}

  async getFriends(userId: string) {
    const friends = (await this.friendModel.findAll({
      where: { userId },
      include: [
        {
          model: User,
          as: 'friend',
          attributes: { exclude: ['passwordHash'] }
        }
      ]
    })) as (Friend & { friend: User })[];

    return friends.map((friend) => new FriendDTO(friend.friend));
  }

  async addFriend(userId: string, friendIdOrEmail: string) {
    const isUuid = (value: string) =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(value);

    const whereCondition = isUuid(friendIdOrEmail)
      ? { userId: friendIdOrEmail }
      : { email: friendIdOrEmail };

    const friendExists = await this.userModel.findOne({
      where: whereCondition
    });

    if (!friendExists) {
      throw new NotFoundException('Friend not found');
    }

    await this.friendModel.create({ userId, friendUserId: friendExists.userId });
    return { message: 'Friend added successfully' };
  }

  async removeFriend(userId: string, friendUserId: string) {
    const result = await this.friendModel.destroy({
      where: { userId, friendUserId }
    });

    if (!result) {
      throw new NotFoundException('Friend not found');
    }

    return { message: 'Friend removed successfully' };
  }
}

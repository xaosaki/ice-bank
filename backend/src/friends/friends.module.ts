import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { User } from '../common/models/user.model';
import { Friend } from '../common/models/friend.model';
import { JwtStrategy } from '../common/strategies/jwt.strategy';

@Module({
  imports: [SequelizeModule.forFeature([Friend, User])],
  controllers: [FriendsController],
  providers: [JwtStrategy, FriendsService]
})
export class FriendsModule {}

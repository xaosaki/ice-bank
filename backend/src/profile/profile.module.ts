import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { User } from '../common/models/user.model';
import { JwtStrategy } from '../common/strategies/jwt.strategy';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  controllers: [ProfileController],
  providers: [JwtStrategy, ProfileService]
})
export class ProfileModule {}

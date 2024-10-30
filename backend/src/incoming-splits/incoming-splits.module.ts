import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { IncomingSplitsService } from './incoming-splits.service';
import { IncomingSplitsController } from './incoming-splits.controller';
import { User } from '../common/models/user.model';
import { Split } from '../common/models/split.model';
import { SplitPart } from '../common/models/split-part.model';
import { JwtStrategy } from '../common/strategies/jwt.strategy';

@Module({
  imports: [SequelizeModule.forFeature([Split, SplitPart, User])],
  controllers: [IncomingSplitsController],
  providers: [JwtStrategy, IncomingSplitsService]
})
export class IncomingSplitsModule {}
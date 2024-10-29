import { Global, Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { BlacklistToken } from '../../models/blacklist-token.model';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  providers: [TokenService],
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRE_TIME }
    }),
    SequelizeModule.forFeature([BlacklistToken])
  ],
  exports: [TokenService]
})
export class TokenModule {}

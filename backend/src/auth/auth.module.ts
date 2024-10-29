import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import * as dotenv from 'dotenv';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../common/models/user.model';
import { makeCounterProvider } from '@willsoto/nestjs-prometheus';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { BlacklistToken } from '../common/models/blacklist-token.model';
import { TokenCleanupService } from './token-cleanup.service';

dotenv.config();

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRE_TIME }
    }),
    SequelizeModule.forFeature([User]),
    SequelizeModule.forFeature([BlacklistToken])
  ],
  providers: [
    AuthService,
    TokenCleanupService,
    JwtStrategy,
    LocalStrategy,
    makeCounterProvider({
      name: 'login_count',
      help: 'Count logins',
      labelNames: ['status']
    }),
    makeCounterProvider({
      name: 'registrations_count',
      help: 'Count registrations'
    })
  ],
  controllers: [AuthController]
})
export class AuthModule {}

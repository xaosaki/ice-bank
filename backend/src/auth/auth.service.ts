import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDTO } from './dto/register.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../common/models/user.model';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';
import { UniqueConstraintError } from 'sequelize';
import { LoginResponseDTO } from './dto/login-response.dto';
import { TokenService } from '../common/modules/token/token.service';
import { Account } from '../common/models/account.model';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(Account)
    private readonly accountModel: typeof Account,
    private readonly sequelize: Sequelize,
    private jwtService: JwtService,
    private tokenService: TokenService,
    @InjectMetric('login_count') public loginCount: Counter<string>,
    @InjectMetric('registrations_count') public registerCount: Counter<string>
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      const { password_hash, ...result } = user.get({ plain: true });
      return result;
    }
    return null;
  }

  async login(user: any): Promise<LoginResponseDTO> {
    const payload = { username: user.email, sub: user.userId };
    // TODO: switch to 2 token system (refresh, access)
    this.loginCount.inc({ status: 'success' });
    return {
      userId: user.userId,
      accessToken: this.jwtService.sign(payload)
    };
  }

  async register(registerDTO: RegisterDTO) {
    const transaction = await this.sequelize.transaction();

    try {
      const passwordHash = await bcrypt.hash(registerDTO.password, 10);
      const user = await this.userModel
        .create({ ...registerDTO, passwordHash }, { transaction })
        .then((model) => model.toDTO());

      // TODO: Don't forget to remove in real world
      const accounts = [
        ['Daily account', 1000],
        ['Checking account', 500],
        ['Another account', 750]
      ];
      for (const account of accounts) {
        await this.accountModel.create(
          {
            accountId: crypto.randomUUID(),
            name: account[0],
            userId: user.userId,
            balance: account[1],
            currency: 'CAD'
          },
          { transaction }
        );
      }

      await transaction.commit();

      this.registerCount.inc();

      return user;
    } catch (error: any) {
      await transaction.rollback();

      if (error instanceof UniqueConstraintError) {
        const message = error.errors.map((e) => `${e.path} must be unique`).join(', ');

        throw new BadRequestException(message);
      }

      throw new BadRequestException('Bad request');
    }
  }

  async logout(token: string): Promise<void> {
    await this.tokenService.addTokenToBlacklist(token);
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDTO } from './dto/register.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../common/models/user.model';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';
import { BlacklistToken } from '../common/models/blacklist-token.model';
import { UniqueConstraintError } from 'sequelize';
import { LoginResponseDTO } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(BlacklistToken)
    private readonly blacklistToken: typeof BlacklistToken,
    private jwtService: JwtService,
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
    try {
      const passwordHash = await bcrypt.hash(registerDTO.password, 10);
      const user = await this.userModel
        .create({ ...registerDTO, passwordHash })
        .then((model) => model.toDTO());

      this.registerCount.inc();

      return user;
    } catch (error: any) {
      if (error instanceof UniqueConstraintError) {
        const message = error.errors.map((e) => `${e.path} must be unique`).join(', ');

        throw new BadRequestException(message);
      }

      throw new BadRequestException('Bad request');
    }
  }

  async logout(token: string): Promise<void> {
    const decodedToken = this.jwtService.decode(token) as { exp: number };
    const expiresAt = new Date(decodedToken.exp * 1000);

    await this.blacklistToken.create({ token, expiresAt });
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const blacklistEntry = await this.blacklistToken.findOne({ where: { token } });
    return !!blacklistEntry;
  }
}

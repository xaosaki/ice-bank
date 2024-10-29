import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { BlacklistToken } from '../../models/blacklist-token.model';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(BlacklistToken)
    private readonly blacklistToken: typeof BlacklistToken,
    private jwtService: JwtService
  ) {}

  async addTokenToBlacklist(token: string): Promise<void> {
    const decodedToken = this.jwtService.decode(token) as { exp: number };
    const expiresAt = new Date(decodedToken.exp * 1000);

    await this.blacklistToken.create({ token, expiresAt });
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const blacklistEntry = await this.blacklistToken.findOne({ where: { token } });
    return !!blacklistEntry;
  }
}

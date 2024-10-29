import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (token && (await this.authService.isTokenBlacklisted(token))) {
      throw new UnauthorizedException();
    }

    return super.canActivate(context) as Promise<boolean>;
  }

  private extractTokenFromHeader(request: any): string | null {
    const authHeader = request.headers['authorization'];
    if (!authHeader) return null;
    return authHeader.replace('Bearer ', '');
  }
}

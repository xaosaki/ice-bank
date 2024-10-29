import { Body, Controller, Headers, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { RegisterResponseDTO } from './dto/register-responce.dto';
import { LoginResponseDTO } from './dto/login-response.dto';
import { ErrorResponseDTO } from '../common/dto/error-response.dto';

@ApiTags('auth')
@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({
    description: 'Successful registration',
    type: RegisterResponseDTO
  })
  @Post('register')
  register(@Body() registerDTO: RegisterDTO): Promise<RegisterResponseDTO> {
    return this.authService.register(registerDTO);
  }

  @ApiOkResponse({
    description: 'Successful registration',
    type: LoginResponseDTO
  })
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  async login(@Request() req: any, @Body() _: LoginDTO): Promise<LoginResponseDTO> {
    return this.authService.login(req.user);
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    type: ErrorResponseDTO
  })
  @ApiOkResponse({
    description: 'Logout successful'
  })
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Headers() headers: any) {
    // Can't use @Headers('authorization') cause of swagger
    const token = headers['authorization']?.replace('Bearer ', '');
    if (token) {
      await this.authService.logout(token);
    }
    return;
  }
}

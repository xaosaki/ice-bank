import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ProfileDTO } from './dto/profile.dto';

@ApiBearerAuth()
@ApiTags('profile')
@UseGuards(JwtAuthGuard)
@Controller('v1/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiOkResponse({ description: 'User profile', type: ProfileDTO })
  @Get()
  async getProfile(@Request() req: any): Promise<ProfileDTO> {
    const userId = req.user.userId;
    return this.profileService.getProfile(userId);
  }
}

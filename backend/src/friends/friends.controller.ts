import { Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { FriendsService } from './friends.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FriendDTO } from './dto/friend.dto';

@ApiBearerAuth()
@ApiTags('friends')
@UseGuards(JwtAuthGuard)
@Controller('v1/friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @ApiOkResponse({
    description: 'List of friends',
    type: [FriendDTO]
  })
  @Get()
  async getFriends(@Request() req: any) {
    const userId = req.user.userId;
    return this.friendsService.getFriends(userId);
  }

  @Post(':userId')
  async addFriend(@Param('userId') friendUserId: string, @Request() req: any) {
    const userId = req.user.userId;
    return this.friendsService.addFriend(userId, friendUserId);
  }

  @Delete(':userId')
  async removeFriend(@Param('userId') friendUserId: string, @Request() req: any) {
    const userId = req.user.userId;
    return this.friendsService.removeFriend(userId, friendUserId);
  }
}

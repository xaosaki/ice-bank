import { Body, Controller, Get, HttpCode, Param, Post, Request, UseGuards } from '@nestjs/common';
import { IncomingSplitsService } from './incoming-splits.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { IncomingSplitDTO } from './dto/incoming-split.dto';
import { ProcessSplitDTO } from './dto/process-split.dto';

@ApiBearerAuth()
@ApiTags('incoming-splits')
@UseGuards(JwtAuthGuard)
@Controller('v1/splits/incoming')
export class IncomingSplitsController {
  constructor(private readonly splitsService: IncomingSplitsService) {}

  @ApiOkResponse({
    description: 'Splits list',
    type: [IncomingSplitDTO]
  })
  @Get()
  async getIncomingSplits(@Request() req: any) {
    const userId = req.user.userId;
    return this.splitsService.getIncomingSplits(userId);
  }

  @ApiOkResponse({
    description: 'Split details',
    type: IncomingSplitDTO
  })
  @Get(':splitId')
  async getIncomingSplitById(@Param('splitId') splitId: string, @Request() req: any) {
    const userId = req.user.userId;
    return this.splitsService.getIncomingSplitById(splitId, userId);
  }

  @ApiBody({ type: ProcessSplitDTO })
  @HttpCode(200)
  @Post(':splitId/process')
  async processIncomingSplit(
    @Param('splitId') splitId: string,
    @Body() body: ProcessSplitDTO,
    @Request() req: any
  ) {
    const userId = req.user.userId;
    return this.splitsService.processIncomingSplit(
      splitId,
      userId,
      body.action,
      body.accountId,
      body.comment
    );
  }
}

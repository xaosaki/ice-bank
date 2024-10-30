import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards
} from '@nestjs/common';
import { OutgoingSplitsService } from './outgoing-splits.service';
import { CreateSplitDTO } from './dto/create-split.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { ErrorResponseDTO } from '../common/dto/error-response.dto';
import { OutgoingSplitDTO } from './dto/outgoing-split.dto';

@ApiBearerAuth()
@ApiTags('outgoing-splits')
@ApiUnauthorizedResponse({ description: 'Unauthorized', type: ErrorResponseDTO })
@ApiInternalServerErrorResponse({ description: 'Error', type: ErrorResponseDTO })
@UseGuards(JwtAuthGuard)
@Controller('v1/splits/outgoing')
export class OutgoingSplitsController {
  constructor(private readonly splitsService: OutgoingSplitsService) {}

  @ApiCreatedResponse({
    description: 'Successful split creation',
    type: OutgoingSplitDTO
  })
  @Post()
  async createSplit(
    @Body() createSplitDto: CreateSplitDTO,
    @Request() req: any
  ): Promise<OutgoingSplitDTO> {
    const userId = req.user.userId;
    return this.splitsService.createSplit(createSplitDto, userId);
  }

  @Delete(':splitId')
  async cancelSplit(@Param('splitId') splitId: string, @Request() req: any) {
    const userId = req.user.userId;
    return this.splitsService.cancelSplit(splitId, userId);
  }

  @ApiOkResponse({
    description: 'Splits list',
    type: [OutgoingSplitDTO]
  })
  @Get()
  async getSplits(@Query('transactionId') transactionId: string, @Request() req: any) {
    const userId = req.user.userId;
    return this.splitsService.getSplits(transactionId, userId);
  }

  @ApiOkResponse({
    description: 'Splits details',
    type: OutgoingSplitDTO
  })
  @Get(':splitId')
  async getSplitById(@Param('splitId') splitId: string, @Request() req: any) {
    const userId = req.user.userId;
    return this.splitsService.getSplitById(splitId, userId);
  }
}

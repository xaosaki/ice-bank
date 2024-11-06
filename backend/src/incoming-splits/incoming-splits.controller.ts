import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Request,
  Res,
  UseGuards
} from '@nestjs/common';
import { IncomingSplitsService } from './incoming-splits.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiParam,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
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
    return this.splitsService.getIncomingSplitById(splitId, userId) as Promise<IncomingSplitDTO>;
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

  @ApiParam({
    name: 'filename',
    required: true,
    description: 'The name of the file to retrieve',
    schema: { type: 'string' }
  })
  @ApiResponse({
    status: 200,
    description: 'The image file stream is returned successfully.',
    content: {
      'application/octet-stream': {
        schema: {
          type: 'string',
          format: 'binary'
        }
      }
    }
  })
  @Get(':splitId/receipt')
  async getReceipt(@Param('splitId') splitId: string, @Request() req: any, @Res() res: Response) {
    const userId = req.user.userId;
    const receiptStream = await this.splitsService.getReceipt(splitId, userId);
    receiptStream.pipe(res);
  }
}

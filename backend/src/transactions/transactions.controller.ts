import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TransactionsService } from './transactions.service';
import { TransactionDTO } from './dto/transaction.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiInternalServerErrorResponse,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { CreateTransactionDTO } from './dto/create-transaction.dto';
import { ErrorResponseDTO } from '../common/dto/error-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth()
@ApiTags('transactions')
@ApiUnauthorizedResponse({ description: 'Unauthorized', type: ErrorResponseDTO })
@ApiInternalServerErrorResponse({ description: 'Error', type: ErrorResponseDTO })
@UseGuards(JwtAuthGuard)
@Controller('v1/transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async createTransaction(
    @Body() createTransactionDTO: CreateTransactionDTO,
    @Request() req: any
  ): Promise<TransactionDTO> {
    const userId = req.user.userId;
    return this.transactionsService.createTransaction(createTransactionDTO, userId);
  }

  @Get(':transactionId')
  async getTransactionById(
    @Param('transactionId') transactionId: string,
    @Request() req: any
  ): Promise<TransactionDTO> {
    const userId = req.user.userId;
    const transaction = (await this.transactionsService.getTransactionById(
      transactionId,
      userId
    )) as TransactionDTO;
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return transaction;
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image file to upload',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary'
        }
      }
    }
  })
  @Post(':transactionId/receipt')
  @UseInterceptors(FileInterceptor('file'))
  async addReceipt(
    @Param('transactionId') transactionId: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any
  ): Promise<{ message: string }> {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/heic',
      'image/heif'
    ];
    const maxSizeInBytes = 10 * 1024 * 1024; // 10 MB

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Only image files are allowed (jpeg, png, gif, webp, heic, heif)'
      );
    }

    if (file.size > maxSizeInBytes) {
      throw new BadRequestException('File size must be less than 10 MB');
    }

    const userId = req.user.userId;
    await this.transactionsService.addReceipt(transactionId, userId, file);
    return { message: 'Receipt uploaded successfully' };
  }

  @Delete(':transactionId/receipt')
  async removeReceipt(
    @Param('transactionId') transactionId: string,
    @Request() req: any
  ): Promise<{ message: string }> {
    const userId = req.user.userId;
    await this.transactionsService.removeReceipt(transactionId, userId);
    return { message: 'Receipt removed successfully' };
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
  @Get(':transactionId/receipt')
  async getReceipt(
    @Param('transactionId') transactionId: string,
    @Request() req: any,
    @Res() res: Response
  ) {
    const userId = req.user.userId;
    const receiptStream = await this.transactionsService.getReceipt(transactionId, userId);
    receiptStream.pipe(res);
  }
}

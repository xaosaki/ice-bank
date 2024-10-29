import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TransactionsService } from './transactions.service';
import { TransactionDTO } from './dto/transaction.dto';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { CreateTransactionDTO } from './dto/create-transaction.dto';
import { ErrorResponseDTO } from '../common/dto/error-response.dto';

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
    const transaction = await this.transactionsService.getTransactionById(transactionId, userId);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return transaction;
  }
}

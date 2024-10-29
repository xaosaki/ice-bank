import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AccountsService } from './accounts.service';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { AccountDTO } from './dto/account.dto';
import { ErrorResponseDTO } from '../common/dto/error-response.dto';
import { AccountTransactionDTO } from './dto/account-transaction.dto';

@ApiTags('accounts')
@ApiUnauthorizedResponse({ description: 'Unauthorized', type: ErrorResponseDTO })
@ApiInternalServerErrorResponse({ description: 'Error', type: ErrorResponseDTO })
@UseGuards(JwtAuthGuard)
@Controller('v1/accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'List of accounts',
    type: [AccountDTO]
  })
  @Get()
  async getAccounts(@Request() req: any): Promise<AccountDTO[]> {
    const userId = req.user.userId;
    const accounts = await this.accountsService.getAccountsByUserId(userId);
    return accounts.map((account) => ({
      accountId: account.accountId,
      balance: account.balance,
      currency: account.currency
    }));
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'List of transactions for the account',
    type: [AccountTransactionDTO]
  })
  @ApiNotFoundResponse({ description: 'Account not found or access denied' })
  @Get(':accountId/transactions')
  async getTransactions(
    @Param('accountId') accountId: string,
    @Request() req: any
  ): Promise<AccountTransactionDTO[]> {
    const userId = req.user.userId;
    const transactions = await this.accountsService.getAccountTransactions(accountId, userId);

    return transactions.map((transaction) => new AccountTransactionDTO(transaction));
  }
}

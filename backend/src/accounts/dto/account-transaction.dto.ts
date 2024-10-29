import { ApiProperty } from '@nestjs/swagger';
import { Transaction } from '../../common/models/transaction.model';
import { Merchant } from '../../common/models/merchant.model';
import { AccountMerchantDTO } from './account-merchant.dto';

export class AccountTransactionDTO {
  @ApiProperty({ example: '00000000-0000-4000-8000-000000000001' })
  readonly transactionId: string;

  @ApiProperty({ example: '00000000-0000-4000-8000-000000000002' })
  readonly accountId: string;

  @ApiProperty({ example: 100.5 })
  readonly amount: number;

  @ApiProperty({ example: 'Payment for subscription' })
  readonly description: string;

  @ApiProperty({ example: '2024-10-29T11:30:00Z' })
  readonly date: string;

  @ApiProperty({ example: 'Subscription' })
  readonly category: string;

  @ApiProperty({ type: AccountMerchantDTO })
  readonly merchant: AccountMerchantDTO | null;

  constructor({
    transactionId,
    accountId,
    amount,
    description,
    date,
    category,
    merchant
  }: Transaction & { merchant: Merchant | null }) {
    this.transactionId = transactionId;
    this.accountId = accountId;
    this.amount = Number(amount);
    this.description = description;
    this.date = date.toISOString();
    this.category = category;
    this.merchant = merchant ? new AccountMerchantDTO(merchant) : null;
  }
}

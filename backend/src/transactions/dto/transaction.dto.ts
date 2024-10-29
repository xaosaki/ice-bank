import { ApiProperty } from '@nestjs/swagger';
import { MerchantDTO } from './merchant.dto';
import { TransactionJoined } from '../transactions.service';

export class TransactionDTO {
  @ApiProperty({ example: '00000000-0000-4000-8000-000000000002' })
  transactionId: string;

  @ApiProperty({ example: '00000000-0000-4000-8000-000000000001' })
  accountId: string;

  @ApiProperty({ example: 100.5 })
  amount: number;

  @ApiProperty({ example: 'Grocery shopping' })
  description: string;

  @ApiProperty({ example: '2024-10-29T11:30:00Z' })
  date: string;

  @ApiProperty({ example: 'Groceries' })
  category: string;

  @ApiProperty({ type: MerchantDTO })
  merchant: MerchantDTO;

  @ApiProperty({ example: 'Bought fruits and vegetables' })
  note: string | null;

  @ApiProperty({ example: '/receipts/1234.png' })
  receipt: string | null;

  constructor({
    accountId,
    amount,
    category,
    date,
    description,
    merchant,
    note,
    receipt,
    transactionId
  }: TransactionJoined) {
    this.transactionId = transactionId;
    this.accountId = accountId;
    this.amount = Number(amount);
    this.description = description;
    this.date = date.toISOString();
    this.category = category;
    this.merchant = new MerchantDTO(merchant);
    this.note = note;
    this.receipt = receipt;
  }
}

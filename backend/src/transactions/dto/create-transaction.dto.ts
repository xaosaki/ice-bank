import { ApiProperty } from '@nestjs/swagger';
import { MerchantDTO } from './merchant.dto';

export class CreateTransactionDTO {
  @ApiProperty({ example: crypto.randomUUID() })
  transactionId: string;

  @ApiProperty({ example: '00000000-0000-4000-8000-000000000001' })
  accountId: string;

  @ApiProperty({ example: 100.5 })
  amount: number;

  @ApiProperty({ example: 'Grocery shopping' })
  description: string;

  @ApiProperty({ example: 'Groceries' })
  category: string;

  @ApiProperty({ type: MerchantDTO, required: false })
  merchant?: MerchantDTO;

  @ApiProperty({ example: 'Bought fruits and vegetables' })
  note: string;
}

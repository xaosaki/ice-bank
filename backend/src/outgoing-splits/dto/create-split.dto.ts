import { ApiProperty } from '@nestjs/swagger';

export class CreateSplitDTO {
  @ApiProperty({ example: '00000000-0000-4000-8000-000000000001' })
  splitId: string;

  @ApiProperty({ example: '00000000-0000-4000-8000-000000000002' })
  transactionId: string;

  @ApiProperty({ example: '/receipts/1234.png' })
  receipt: string;

  @ApiProperty({ example: 100.0 })
  amount: number;

  @ApiProperty({ example: [{ userId: '00000000-0000-4000-8000-000000000002', amount: 100 }] })
  users: { userId: string; amount: number }[];
}

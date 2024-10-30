import { ApiProperty } from '@nestjs/swagger';
import { SplitPart } from '../../common/models/split-part.model';

export class OutgoingSplitDTO {
  @ApiProperty({ example: '00000000-0000-4000-8000-000000000002' })
  splitId: string;

  @ApiProperty({ example: '00000000-0000-4000-8000-000000000001' })
  transactionId: string;

  @ApiProperty({ example: 'Dinner with friends' })
  transactionName: string;

  @ApiProperty({ example: '/receipts/1234.png', nullable: true })
  transactionLogo: string | null;

  @ApiProperty({ example: '2024-10-29T11:30:00Z' })
  transactionDate: string;

  @ApiProperty({ example: 100.0 })
  amount: number;

  @ApiProperty({ example: '/receipts/split123.png', nullable: true })
  receipt: string | null;

  @ApiProperty({ example: 'Pending' })
  status: 'Pending' | 'Completed' | 'Canceled';

  @ApiProperty({ example: '00000000-0000-4000-8000-000000000003' })
  fromUserId: string;

  @ApiProperty({
    example: [
      {
        userId: '00000000-0000-4000-8000-000000000004',
        amount: 50.0,
        status: 'Pending'
      }
    ]
  })
  users: Array<{ userId: string; amount: number; status: string }>;

  constructor(split: any, parts: SplitPart[]) {
    this.splitId = split.splitId;
    this.transactionId = split.transactionId;
    this.transactionName = split.transactionName;
    this.transactionLogo = split.transactionLogo;
    this.transactionDate = split.transactionDate.toISOString();
    this.amount = Number(split.amount);
    this.receipt = split.receipt;
    this.status = split.status;
    this.fromUserId = split.fromUserId;
    this.users = parts.map((part) => ({
      userId: part.userId,
      amount: Number(part.amount),
      status: part.status
    }));
  }
}

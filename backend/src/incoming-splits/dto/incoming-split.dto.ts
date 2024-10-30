import { ApiProperty } from '@nestjs/swagger';
import { IncomingSplitUserDTO } from './is-user.dto';
import { User } from 'src/common/models/user.model';

export class IncomingSplitDTO {
  @ApiProperty({ example: '00000000-0000-4000-8000-000000000002' })
  splitId: string;

  @ApiProperty({ example: 'Dinner with friends' })
  transactionName: string;

  @ApiProperty({ example: '/receipts/logo.png', nullable: true })
  transactionLogo: string | null;

  @ApiProperty({ example: '2024-10-29T11:30:00Z' })
  transactionDate: string;

  @ApiProperty({ example: 50.0 })
  amountForPay: number;

  @ApiProperty({
    type: IncomingSplitUserDTO
  })
  fromUser: Record<string, any>;

  @ApiProperty({ example: '/receipts/split123.png', nullable: true })
  receipt: string | null;

  @ApiProperty({ example: 'Pending' })
  answerStatus: 'Pending' | 'Completed' | 'Canceled';

  @ApiProperty({ example: 'Pending' })
  splitStatus: 'Pending' | 'Completed' | 'Canceled';

  @ApiProperty({ example: 'Thanks for the dinner!', nullable: true })
  comment: string | null;

  constructor(split: any, splitPart: any, fromUser: User) {
    this.splitId = split.splitId;
    this.transactionName = split.transactionName;
    this.transactionLogo = split.transactionLogo;
    this.transactionDate = split.transactionDate.toISOString();
    this.amountForPay = Number(splitPart.amount);
    this.fromUser = new IncomingSplitUserDTO(fromUser);
    this.receipt = split.receipt;
    this.splitStatus = split.status;
    this.answerStatus = splitPart.status;
    this.comment = splitPart.comment;
  }
}

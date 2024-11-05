import { ApiProperty } from '@nestjs/swagger';

export class ProcessSplitDTO {
  @ApiProperty({ example: 'accept', enum: ['accept', 'decline'] })
  action: 'accept' | 'decline';

  @ApiProperty({
    example: '00000000-0000-4000-8000-000000000002'
  })
  accountId: string;

  @ApiProperty({
    example: 'Thanks for the dinner!',
    nullable: true,
    description: 'Optional comment'
  })
  comment?: string;
}

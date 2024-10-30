import { ApiProperty } from '@nestjs/swagger';

export class ProcessSplitDTO {
  @ApiProperty({ example: 'accept', enum: ['accept', 'decline'] })
  action: 'accept' | 'decline';

  @ApiProperty({
    example: 'Thanks for the dinner!',
    nullable: true,
    description: 'Optional comment'
  })
  comment?: string;
}

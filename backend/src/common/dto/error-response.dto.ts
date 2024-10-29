import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDTO {
  @ApiProperty({
    example: 'Error'
  })
  readonly message: string;

  @ApiProperty({
    example: 400
  })
  readonly statusCode: number;
}

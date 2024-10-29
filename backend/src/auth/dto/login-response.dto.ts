import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDTO {
  @ApiProperty({
    example: '00000000-0000-4000-8000-000000000001'
  })
  readonly userId: string;

  @ApiProperty({
    example: 'abc.abc.abc'
  })
  readonly accessToken: string;
}

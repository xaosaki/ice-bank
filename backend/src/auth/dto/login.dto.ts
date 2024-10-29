import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @ApiProperty({
    example: 'a@m.com'
  })
  readonly email: string;

  @ApiProperty({
    example: '123456'
  })
  readonly password: string;
}

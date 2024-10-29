import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDTO {
  @ApiProperty({
    example: '00000000-0000-4000-8000-000000000001'
  })
  readonly userId: string;

  @ApiProperty({
    example: 'a@m.com'
  })
  readonly email: string;

  @ApiProperty({
    example: '123456'
  })
  readonly password: string;

  @ApiProperty({
    example: 'Joe'
  })
  readonly firstName: string;

  @ApiProperty({
    example: 'Doe'
  })
  readonly lastName: string;

  @ApiPropertyOptional({
    example: 'M'
  })
  readonly middleName?: string;

  @ApiPropertyOptional({
    example: '333-222-11-11'
  })
  readonly phone?: string;
}

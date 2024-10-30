import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../common/models/user.model';

export class ProfileDTO {
  @ApiProperty({ example: '00000000-0000-4000-8000-000000000001' })
  userId: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiProperty({ example: 'Middle', nullable: true })
  middleName: string | null;

  @ApiProperty({ example: '/avatars/1234.png', nullable: true })
  avatar: string | null;

  @ApiProperty({ example: '+1234567890', nullable: true })
  phone: string | null;

  constructor(user: User) {
    this.userId = user.userId;
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.middleName = user.middleName;
    this.phone = user.phone;
  }
}

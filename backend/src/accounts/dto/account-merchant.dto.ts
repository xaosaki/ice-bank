import { ApiProperty } from '@nestjs/swagger';
import { Merchant } from '../../common/models/merchant.model';

export class AccountMerchantDTO {
  @ApiProperty({ example: 'Amazon' })
  readonly name: string;

  @ApiProperty({ example: 'amazon.png', required: false })
  readonly logo: string | null;

  constructor(merchant: Merchant) {
    this.name = merchant.name;
    this.logo = merchant.logo;
  }
}

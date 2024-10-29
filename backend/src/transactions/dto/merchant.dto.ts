import { ApiProperty } from '@nestjs/swagger';

export class MerchantDTO {
  @ApiProperty({ example: 'Amazon' })
  name: string;

  @ApiProperty({ example: 'https://logo.com/amazon.png', required: false })
  logo?: string;

  @ApiProperty({ example: '00000000-0000-4000-8000-000000000002' })
  merchantId: string;

  @ApiProperty({ example: '5999' })
  mcc?: string;

  constructor(merchant: any) {
    this.name = merchant.name;
    this.logo = merchant.logo;
    this.merchantId = merchant.merchantId;
    this.mcc = merchant.mcc;
  }
}

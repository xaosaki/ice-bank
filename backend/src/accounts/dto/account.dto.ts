import { ApiProperty } from '@nestjs/swagger';
import { Account } from '../../common/models/account.model';

export class AccountDTO {
  @ApiProperty({ example: '00000000-0000-4000-8000-000000000002' })
  readonly accountId: string;

  @ApiProperty({ example: 100.5 })
  readonly balance: number;

  @ApiProperty({ example: 'Checking account' })
  readonly name: string;

  @ApiProperty({ example: 'CAD' })
  readonly currency: 'CAD' | 'USD';

  constructor({ accountId, balance, currency, name }: Account) {
    this.accountId = accountId;
    this.balance = Number(balance);
    this.currency = currency;
    this.name = name;
  }
}

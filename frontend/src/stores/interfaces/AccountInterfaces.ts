export interface Account {
  readonly accountId: string;
  readonly name: string;
  readonly balance: number;
  readonly currency: 'CAD' | 'USD';
}

export interface AccountTransaction {
  readonly transactionId: string;
  readonly accountId: string;
  readonly amount: number;
  readonly description: string;
  readonly date: string;
  readonly category: string;
  readonly merchant: AccountMerchant | null;
}

export interface AccountMerchant {
  readonly name: string;
  readonly logo: string | null;
}

export interface AccountTransactionGroup {
  date: string;
  transactions: AccountTransaction[];
  totalAmount: number;
}

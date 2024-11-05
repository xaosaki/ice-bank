import type { OutSplitResponse } from '@/stores/interfaces/OutSplitInterfaces';

export interface Merchant {
  name: string;
  logo?: string;
  merchantId: string;
  mcc?: string;
}

export interface Transaction {
  transactionId: string;
  accountId: string;
  amount: number;
  description: string;
  date: string;
  category: string;
  merchant: Merchant;
  note: string | null;
  receipt: string | null;
}

export type SplitByTransactionResponse = OutSplitResponse;
export type SplitByTransaction = OutSplitResponse & { filledAmount: number };

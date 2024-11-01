import type { Friend } from '@/stores/interfaces/FriendInterfaces';

export type SplitPart = Friend & {
  amount: number;
  touched: boolean;
};

export type SplitPartParams = {
  userId: string;
  amount: number;
};

export interface SplitParams {
  splitId: string;
  transactionId: string;
  receipt: string | null;
  amount: number;
  users: SplitPartParams[];
}

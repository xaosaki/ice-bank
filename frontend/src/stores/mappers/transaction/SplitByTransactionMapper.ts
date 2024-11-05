import type {
  SplitByTransaction,
  SplitByTransactionResponse
} from '@/stores/interfaces/TransactionInterfaces';

export function mapSplitByTransaction(split: SplitByTransactionResponse): SplitByTransaction {
  return {
    ...split,
    filledAmount: split.users.reduce((acc, user) => {
      if (user.status === 'Accepted') {
        acc += user.amount;
      }

      return acc;
    }, 0)
  };
}

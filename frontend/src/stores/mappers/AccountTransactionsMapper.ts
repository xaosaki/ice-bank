import type {
  AccountTransaction,
  AccountTransactionGroup
} from '@/stores/interfaces/AccountInterfaces';

export function mapAccountTransactions(
  transactions: AccountTransaction[]
): AccountTransactionGroup[] {
  const sortedTransactions = transactions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const groupedTransactions: Record<string, AccountTransaction[]> = sortedTransactions.reduce(
    (acc, transaction) => {
      const date = transaction.date.split('T')[0];

      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(transaction);
      return acc;
    },
    {} as Record<string, AccountTransaction[]>
  );

  return Object.entries(groupedTransactions).map((entry) => ({
    date: entry[0],
    transactions: entry[1],
    totalAmount: entry[1].reduce((sum, transaction) => sum + transaction.amount, 0)
  }));
}

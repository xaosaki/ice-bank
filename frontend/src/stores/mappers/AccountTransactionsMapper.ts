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
      const dateObj = new Date(transaction.date);

      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      if (!acc[formattedDate]) {
        acc[formattedDate] = [];
      }
      acc[formattedDate].push(transaction);
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

import type {
  InSplit,
  InSplitAnswerStatus,
  InSplitGroup,
  InSplitResponse
} from '@/stores/interfaces/InSplitInterfaces';

export function mapInSplitResponsesToGroup(splits: InSplitResponse[]): InSplitGroup[] {
  const sortedSplits = splits.sort(
    (a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
  );

  const groupedSplits: Record<string, InSplit[]> = sortedSplits.reduce(
    (acc, split) => {
      const status = split.answerStatus;

      if (!acc[status]) {
        acc[status] = [];
      }

      acc[status].push(split);
      return acc;
    },
    {} as Record<string, InSplit[]>
  );

  const statusOrder: InSplitAnswerStatus[] = ['Pending', 'Accepted', 'Declined', 'Canceled'];

  return Object.entries(groupedSplits)
    .map((entry) => ({
      status: entry[0] as InSplitAnswerStatus,
      splits: entry[1]
    }))
    .sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));
}

import type {
  OutSplitGroup,
  OutSplit,
  OutSplitResponse,
  OutSplitStatus
} from '@/stores/interfaces/OutSplitInterfaces';
import { mapOutSplit } from '@/stores/mappers/out-split/OutSplitMapper';

export function mapOutSplitResponsesToGroup(splits: OutSplitResponse[]): OutSplitGroup[] {
  const sortedSplits = splits.sort(
    (a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
  );

  const groupedSplits: Record<string, OutSplit[]> = sortedSplits.reduce(
    (acc, split) => {
      const status = split.status;

      if (!acc[status]) {
        acc[status] = [];
      }

      acc[status].push(mapOutSplit(split));
      return acc;
    },
    {} as Record<string, OutSplit[]>
  );

  const statusOrder: OutSplitStatus[] = ['Pending', 'Completed', 'Canceled'];

  return Object.entries(groupedSplits)
    .map((entry) => ({
      status: entry[0] as OutSplitStatus,
      splits: entry[1]
    }))
    .sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));
}

import type { OutSplit, OutSplitResponse } from '@/stores/interfaces/OutSplitInterfaces';
import { mapOutSplitUsers } from '@/stores/mappers/out-split/OutSplitUsersMapper';

export function mapOutSplit(split: OutSplitResponse): OutSplit {
  const { users, ...mappedSplitData } = split;
  return {
    ...mappedSplitData,
    users: mapOutSplitUsers(users),
    filledAmount: users.reduce((acc, user) => {
      if (user.status === 'Accepted') {
        acc += user.amount;
      }

      return acc;
    }, 0)
  };
}

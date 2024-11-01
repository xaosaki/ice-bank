import type {
  OutSplitPartStatus,
  OutSplitUser,
  OutSplitUserGroup
} from '@/stores/interfaces/OutSplitInterfaces';

export function mapOutSplitUsers(users: OutSplitUser[]): OutSplitUserGroup[] {
  const groupedUsers: Record<string, OutSplitUser[]> = users.reduce(
    (acc, user) => {
      const status = user.status;

      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(user);
      return acc;
    },
    {} as Record<string, OutSplitUser[]>
  );

  return Object.entries(groupedUsers).map((entry) => ({
    status: entry[0] as OutSplitPartStatus,
    users: entry[1]
  }));
}

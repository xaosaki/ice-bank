export type OutSplitStatus = 'Pending' | 'Completed' | 'Canceled';
export type OutSplitPartStatus = 'Accepted' | 'Declined' | 'Pending' | 'Canceled';

export interface OutSplitGroup {
  status: OutSplitStatus;
  splits: OutSplit[];
}

export type OutSplit = Omit<OutSplitResponse, 'users'> & {
  filledAmount: number;
  users: OutSplitUserGroup[];
};

export interface OutSplitUserGroup {
  status: OutSplitPartStatus;
  users: OutSplitUser[];
}

export interface OutSplitResponse {
  splitId: string;
  transactionId: string;
  transactionName: string;
  transactionLogo: string | null;
  transactionDate: string;
  amount: number;
  receipt: string | null;
  status: OutSplitStatus;
  fromUserId: string;
  users: OutSplitUser[];
}

export interface OutSplitUser {
  user: OutSplitUserDetails;
  amount: number;
  status: OutSplitPartStatus;
  comment: string;
}

export interface OutSplitUserDetails {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  avatar: string | null;
  phone: string | null;
}

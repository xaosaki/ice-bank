export type OutSplitStatus = 'Pending' | 'Completed' | 'Canceled';
export type OutSplitPartStatus = 'Accepted' | 'Declined' | 'Pending' | 'Canceled';

export interface OutgoingSplitGroup {
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
  user: OutgoingSplitUserDetails;
  amount: number;
  status: OutSplitPartStatus;
  comment: string;
}

export interface OutgoingSplitUserDetails {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  avatar: string | null;
  phone: string | null;
}

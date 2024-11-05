export type InSplitStatus = 'Pending' | 'Completed' | 'Canceled';
export type InSplitAnswerStatus = 'Accepted' | 'Declined' | 'Pending' | 'Canceled';

export interface InSplitGroup {
  status: InSplitAnswerStatus;
  splits: InSplit[];
}

export type InSplit = InSplitResponse;

export interface InSplitResponse {
  splitId: string;
  transactionName: string;
  transactionLogo: string | null;
  transactionDate: string;
  amountForPay: number;
  fromUser: InSplitUserDetails;
  receipt: string | null;
  answerStatus: InSplitAnswerStatus;
  splitStatus: InSplitStatus;
  comment: string | null;
}

export interface InSplitUserDetails {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  avatar: string | null;
  phone: string | null;
}

export interface InSplitProcessParams {
  action: 'accept' | 'decline';
  accountId: string;
  comment: string | null;
}

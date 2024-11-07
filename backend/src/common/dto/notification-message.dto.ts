export enum NotificationMessageType {
  NEW_INCOMING_SPLIT = 'new_incoming_split',
  OUTGOING_SPLIT_ACCEPT = 'outgoing_split_accept',
  OUTGOING_SPLIT_DECLINE = 'outgoing_split_decline'
}

export class NotificationMessageDTO {
  receiver: string;
  sender: string;
  message: string;
  messageType: NotificationMessageType;

  constructor(
    receiver: string,
    sender: string,
    messageType: NotificationMessageType,
    message: string
  ) {
    this.receiver = receiver;
    this.sender = sender;
    this.messageType = messageType;
    this.message = message;
  }
}

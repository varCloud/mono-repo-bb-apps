export interface MessageStatus {
  messageStatusId: number;
  statusCode: string;
  description: string;
}

export interface Message {
  messageId: number;
  content: string;
  sentDate: Date;
  messageStatusId: number;
  conversationId: number;
  messageStatus?: MessageStatus;
  sendMessageUserId: number;
  time?: string;
}

export class MessageModel implements Message {
  messageId: number;
  content: string;
  sentDate: Date;
  messageStatusId: number;
  conversationId: number;
  messageStatus?: MessageStatus;
  time?: string;
  sendMessageUserId: number;

  constructor(data: Message) {
    this.messageId = data.messageId;
    this.content = data.content;
    this.sentDate = new Date(data.sentDate);
    this.messageStatusId = data.messageStatusId;
    this.conversationId = data.conversationId;
    this.messageStatus = data.messageStatus;
    this.sendMessageUserId = data.sendMessageUserId;
    this.time = this.setTime();
  }

  public setTime() {
    const date = new Date(this.sentDate);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  public createPayload(creatorUserId: number, athleteUserId: number) {
    return {
      message: this.content,
      sendMessageUserId: this.sendMessageUserId,
      creatorUserId: creatorUserId,
      athleteUserId: athleteUserId,
    };
  }
}

export class MessageStatusModel implements MessageStatus {
  messageStatusId: number;
  statusCode: string;
  description: string;

  constructor(data: MessageStatus) {
    this.messageStatusId = data.messageStatusId;
    this.statusCode = data.statusCode;
    this.description = data.description;
  }
}

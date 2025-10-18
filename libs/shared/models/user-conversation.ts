export interface UserSummary {
    userId: number;
    firstName: string;
    profilePictureUrl: string;
    nickName?: string;
    
}

export interface MessageSummary {
    messageId: number;
    content: string;
    sentDate: string | Date;
}

export interface UserConversation {
    userConversationId: number;
    lastMessageDate: string | Date;
    creatorUser: UserSummary;
    athleteUser: UserSummary;
    lastMessage: MessageSummary;
}

export class UserConversationModel implements UserConversation {
    userConversationId: number;
    lastMessageDate: Date;
    creatorUser: UserSummary;
    athleteUser: UserSummary;
    lastMessage: { messageId: number; content: string; sentDate: Date };

    constructor(data: UserConversation) {
        this.userConversationId = data.userConversationId;
        this.lastMessageDate = data.lastMessageDate ? new Date(data.lastMessageDate) : new Date(0);
        this.creatorUser = data.creatorUser;
        this.athleteUser = data.athleteUser;
        const lm = data.lastMessage || { messageId: 0, content: '', sentDate: new Date(0) };
        this.lastMessage = {
            messageId: lm.messageId,
            content: lm.content,
            sentDate: new Date(lm.sentDate),
        };
    }
}
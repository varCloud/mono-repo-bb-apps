import { Component, effect, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ChatMessage,
  ChatUser,
  mockMessages,
  mockUser,
} from '../../mocks/chat.mock';
import { UserConversationService } from '../../services/user-conversation.services';
import { Message, MessageModel, ENUM_MESSAGE_STATUS } from '@monorepo-bb-app/shared';
import { take } from 'rxjs';
import { SesionService } from '@monorepo-bb-app/core';
import { User } from '@monorepo-bb-app/shared';
import { send, sendSharp } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { PaginatorModel } from '@monorepo-bb-app/shared';

@Component({
  selector: 'app-user-chat',
  templateUrl: './user-chat.component.html',
  styleUrls: ['./user-chat.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class UserChatComponent implements OnInit {
  @Input() messages: Message[] = [];
  @Input() userInfo: ChatUser | null = null;
  public userSesion!: User;
  public paginator!: PaginatorModel;

  constructor(
    private _userConectionService: UserConversationService,
    private _sesionService: SesionService,
  ) {
    effect(() => {
      const user = this._sesionService.user$();
      this.userSesion = user as User;
    });

    addIcons({ sendSharp });
  }

  newMessage: string = '';

  ngOnInit() {
    // Initialize with mock data if no data is provided
    // if (this.messages.length === 0) {
    //   this.messages = mockMessages;
    // }
    // if (!this.userInfo) {
    //   this.userInfo = mockUser;
    // }

    this.getMessages();
  }

  shouldShowDateDivider(
    currentMessage: Message,
    previousMessage?: Message,
  ): boolean {
    if (!previousMessage) return true;

    const currentDate = new Date(currentMessage.sentDate);
    const previousDate = new Date(previousMessage.sentDate);

    return currentDate.toDateString() !== previousDate.toDateString();
  }

  formatDateDivider(date: Date): string {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'HOY';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'AYER';
    } else {
      // Formato: "1 DE SEPTIEMBRE"
      return date
        .toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'long',
        })
        .toUpperCase();
    }
  }

  onEnterPress(event: any) {
    if (!event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      const now = new Date();
      const newMsg: MessageModel = new MessageModel({
        messageId: 0,
        content: this.newMessage.trim(),
        time: now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        sentDate: now,
        messageStatusId: ENUM_MESSAGE_STATUS.UN_READ,
        conversationId: 1,
        sendMessageUserId: this.userSesion.userId,
      });

      this.messages = [...this.messages, newMsg];
      this.newMessage = '';
      this._userConectionService.message(newMsg.createPayload()).subscribe(
        (response) => {
          console.log('Message sent successfully', response);
        },
        (error) => {
          console.error('Error sending message', error);
        },
      );
    }
  }

  async loadMoreMessages(event: any) {
    if (this.paginator && this.paginator.links.next) {
      await this.getMessages(this.paginator.links.next);
    }
    event.target.complete();
  }

  public async getMessages(uri: string = '', params: any = {}): Promise<void> {
    this._userConectionService
      .getMessages(uri, 1, params)
      .pipe(take(1))
      .subscribe(
        (data) => {
          const { messages, paginator } = data;
          console.log('Messages retrieved successfully', messages);
          this.messages = [...this.messages, ...messages];
          this.paginator = paginator;
        },
        (error) => {
          console.error('Error retrieving messages', error);
        },
      );
  }

  get ENUM_STATUS_MESSAGE() {
    return ENUM_MESSAGE_STATUS;
  }
}

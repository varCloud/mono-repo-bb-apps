import { Component, effect, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ChatMessage,
  ChatUser,
  mockMessages,
  mockUser,
} from '../../mocks/chat.mock';

import { Message, MessageModel, ENUM_MESSAGE_STATUS, UserConversationModel, UserSummary } from '@monorepo-bb-app/shared';
import { take } from 'rxjs';
import { SesionService, UserConversationService } from '@monorepo-bb-app/core';
import { User } from '@monorepo-bb-app/shared';
import { send, sendSharp } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { PaginatorModel } from '@monorepo-bb-app/shared';
import { ENUM_TYPE_USER } from 'libs/shared/constants/enums';
import { UserAvatarComponent } from '@monorepo-bb-app/ui';

@Component({
  selector: 'app-user-chat',
  templateUrl: './user-chat.component.html',
  styleUrls: ['./user-chat.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, UserAvatarComponent],
})
export class UserChatComponent implements OnInit {
  @Input() messages: Message[] = [];
  @Input() userInfo: UserSummary | null = null;
  public userSesion!: User;
  public paginator!: PaginatorModel;
  public userConversationModel!: UserConversationModel;

  constructor(
    private _userConectionService: UserConversationService,
    private _sesionService: SesionService,
    private router: Router,
  ) {

    // Obtener datos de navigation extras usando el nuevo signal
    const navigation = this.router.currentNavigation();
    if (navigation?.extras.state?.['conversation']) {
      this.userConversationModel = (navigation.extras.state['conversation'] as UserConversationModel);
      console.log('Datos recibidos:', this.userConversationModel);
    }

    effect(() => {
      const user = this._sesionService.user$();
      this.userSesion = user as User;
      this.userInfo = user?.userTypeId === ENUM_TYPE_USER.ATHLETE ? this.userConversationModel.creatorUser : this.userConversationModel.athleteUser;
    });
    addIcons({ sendSharp });
    
  }

  newMessage: string = '';

  ngOnInit() {
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
        conversationId: this.userConversationModel.userConversationId,
        sendMessageUserId: this.userSesion.userId,
      });
      this.messages.unshift(newMsg);
      this.newMessage = '';
      const creatorUserId = this.userConversationModel.creatorUser.userId;
      const athleteUserId = this.userConversationModel.athleteUser.userId;
      this._userConectionService.message(newMsg.createPayload(creatorUserId,athleteUserId)).subscribe(
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
      .getMessagesByConversartion(uri, this.userConversationModel.userConversationId, params)
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

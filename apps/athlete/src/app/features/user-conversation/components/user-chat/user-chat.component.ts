import { Component, effect, Input, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


import { Message, MessageModel, ENUM_MESSAGE_STATUS, UserConversationModel, UserSummary } from '@monorepo-bb-app/shared';
import { finalize, take } from 'rxjs';
import { LoaderUIService, SesionService, UserConversationService } from '@monorepo-bb-app/core';
import { User } from '@monorepo-bb-app/shared';
import { send, sendSharp } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { PaginatorModel } from '@monorepo-bb-app/shared';
import { ENUM_TYPE_USER } from 'libs/shared/constants/enums';
import { UserAvatarComponent } from '@monorepo-bb-app/ui';
import { LoggerService } from 'libs/core/services/logger.service';

@Component({
  selector: 'app-user-chat',
  templateUrl: './user-chat.component.html',
  styleUrls: ['./user-chat.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, UserAvatarComponent],
})
export class UserChatComponent  implements AfterViewChecked {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;
  @Input() messages: Message[] = [];
  public userInfo: UserSummary | null = null;
  public userSesion!: User;
  public paginator!: PaginatorModel;
  public userConversationModel!: UserConversationModel;
  public newMessage: string = '';
  public conversationId: number;
  private goToBottom: boolean = true;
  constructor(
    private _userConectionService: UserConversationService,
    private _sesionService: SesionService,
    private _loaderUIService: LoaderUIService,
    private route: ActivatedRoute,
    private logger: LoggerService,
  ) {
    this._serUserInfo();
    effect(() => {
      const user = this._sesionService.user$();
      this.userSesion = user as User;
    });
    addIcons({ sendSharp });
    this.route.paramMap.subscribe(params => {
      this.conversationId = Number(params.get('id') ?? 0);
      this.logger.info('ID del conversationId:', this.conversationId);
    });
  }

  ionViewWillEnter() {
    this._serUserInfo();
  }

  ionViewWillLeave() {
    this.messages = [];
    this.goToBottom = true;
  }

  private _serUserInfo() {
    const state = history.state;
    if (state?.conversation) {
      this.userConversationModel = (state.conversation as UserConversationModel);
      if (this.userConversationModel) {
        this.userInfo = this.userSesion?.userTypeId === ENUM_TYPE_USER.ATHLETE ?
          this.userConversationModel.creatorUser :
          this.userConversationModel.athleteUser;
      }
      console.log('Datos recibidos:', this.userConversationModel);
      this.getMessages();
    }
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
      this.goToBottom=true;
      this._userConectionService.message(newMsg.createPayload(creatorUserId, athleteUserId)).subscribe(
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
      this.goToBottom = false;  
      await this.getMessages(this.paginator.links.next);
    }
    event.target.complete();
  }

  public async getMessages(uri: string = '', params: any = {}): Promise<void> {
    if( !this.conversationId && this.conversationId === 0) {
      return;
    }

    this._loaderUIService.showLoader();
    this._userConectionService
      .getMessagesByConversartion(uri, this.conversationId, params)
      .pipe(take(1), finalize(() => this._loaderUIService.hideLoader()))
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

  ngAfterViewChecked() {
    if(this.goToBottom){
        this.scrollToBottom();
    }
  }

  public scrollToBottom(): void {
    try {
    
        this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight + 15;

    } catch(err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  public scrollToTop(): void {
    try {
        this.messageContainer.nativeElement.scrollTop = 0;
        console.log('Scroll to top executed');
    } catch(err) {
      console.error('Error al hacer scroll al top:', err);
    }
  }
}

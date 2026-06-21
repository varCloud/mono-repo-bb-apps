import { AfterViewChecked, AfterViewInit, Component, effect, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Navigation, Router } from '@angular/router';


import { Message, MessageModel, ENUM_MESSAGE_STATUS, UserConversationModel, UserSummary } from '@monorepo-bb-app/shared';
import { finalize, Subscription, take } from 'rxjs';
import { LoaderUIService, SesionService, UserConversationService } from '@monorepo-bb-app/core';
import { User } from '@monorepo-bb-app/shared';
import { arrowBackOutline, chevronBackOutline, send, sendSharp } from 'ionicons/icons';
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
export class UserChatComponent implements AfterViewChecked, OnDestroy {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;
  @Input() messages: Message[] = [];
  public userInfo: UserSummary | null = null;
  public userSesion!: User;
  public paginator!: PaginatorModel;
  public userConversationModel!: UserConversationModel;
  public newMessage: string = '';
  public conversationId: number = 0;
  private goToBottom: boolean = true;
  private currentConversationId: number | null = null;
  private _paramsSub?: Subscription;

  constructor(
    private _userConectionService: UserConversationService,
    private _sesionService: SesionService,
    private _loaderUIService: LoaderUIService,
    private route: ActivatedRoute,
  ) {
    effect(() => {
      const user = this._sesionService.user$();
      this.userSesion = user as User;
    });
    addIcons({ sendSharp , arrowBackOutline , chevronBackOutline });
    // Recargar cuando la conversación cambia con la página ya montada
    // (caso: tap de push hacia otra conversación). La primera carga la
    // resuelve ionViewWillEnter, cuando la sesión ya está disponible.
    this._paramsSub = this.route.paramMap.subscribe(params => {
      this.conversationId = Number(params.get('id') ?? 0);
      if (this.currentConversationId !== null && this.conversationId !== this.currentConversationId) {
        this.loadConversationFromState();
      }
    });
  }

  ionViewWillEnter() {
    this.loadConversationFromState();
  }

  ionViewWillLeave() {
    this.messages = [];
    this.goToBottom = true;
  }

  ngOnDestroy() {
    this._paramsSub?.unsubscribe();
  }

  private loadConversationFromState() {
    const state = history.state;

    if (state?.conversation) {
      this.userConversationModel = (state.conversation as UserConversationModel);
      if (this.userConversationModel) {
        this.userInfo = this.userSesion?.userTypeId === ENUM_TYPE_USER.ATHLETE ?
          this.userConversationModel.creatorUser :
          this.userConversationModel.athleteUser;
        this.currentConversationId = this.userConversationModel.userConversationId;
      }
      console.log('Datos recibidos:', JSON.stringify(this.userConversationModel));
      this.getMessages();
      this.markAsRead();
    }
  }

  private markAsRead() {
    const id = this.userConversationModel?.userConversationId;
    if (!id) {
      return;
    }
    // Limpieza optimista: actualizar badge del tab y la conversación al instante.
    const removed = this.userConversationModel.unreadCount ?? 0;
    this.userConversationModel.unreadCount = 0;
    this.userConversationModel.hasUnread = false;
    this._userConectionService.registerConversationRead(removed);
    this._userConectionService.markConversationAsRead(id).pipe(take(1)).subscribe({
      next: () => this._userConectionService.refreshUnreadSummary(),
      error: (error) => console.error('Error marking conversation as read', error),
    });
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
    if (!this.userConversationModel?.userConversationId) {
      return;
    }
    this._loaderUIService.showLoader();
    this._userConectionService
      .getMessagesByConversartion(uri, this.userConversationModel.userConversationId, params)
      .pipe(take(1), finalize(() => this._loaderUIService.hideLoader()))
      .subscribe(
        (data) => {
          const { messages, paginator } = data;
          console.log('Messages retrieved successfully', messages);
          // En carga inicial (uri vacío) reemplazar para evitar duplicados;
          // solo concatenar al paginar.
          this.messages = uri ? [...this.messages, ...messages] : messages;
          this.paginator = paginator;
        },
        (error) => {
          console.error('Error retrieving messages', error);
        },
      );
  }

  ngAfterViewChecked() {
    if (this.goToBottom) {
      this.scrollToBottom();
    }
  }

  public scrollToBottom(): void {
    try {

      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight + 15;

    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  get ENUM_STATUS_MESSAGE() {
    return ENUM_MESSAGE_STATUS;
  }
}

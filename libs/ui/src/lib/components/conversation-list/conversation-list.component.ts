import { Component, EventEmitter, input, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {  LoaderUIService, UserConversationService } from '@monorepo-bb-app/core';
import { PaginatorModel, UserConversationModel } from '@monorepo-bb-app/shared';
import { ENUM_TYPE_USER } from 'libs/shared/constants/enums';
import { finalize } from 'rxjs';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';



@Component({
  selector: 'app-conversation-list',
  templateUrl: './conversation-list.component.html',
  styleUrls: ['./conversation-list.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule , UserAvatarComponent],
})
export class ConversationListComponent implements OnInit {
  @Output() conversationSelected = new EventEmitter<UserConversationModel>();

  userId = input.required<number>();
  userTypeId = input.required<number>();
  public conversations: UserConversationModel[] = [];
  public userPropConversation : string = 'creatorUser'

  constructor(
    private readonly _userConversationService:UserConversationService,
    private readonly _loaderService: LoaderUIService
  ) {

  }

  ngOnInit(): void {
    this.getConversations();
    this.userPropConversation = this.userTypeId() !== ENUM_TYPE_USER.ATHLETE ? 'athleteUser' : 'creatorUser';
  }

   ionViewWillEnter() {
    this.getConversations();
    this.userPropConversation = this.userTypeId() !== ENUM_TYPE_USER.ATHLETE ? 'athleteUser' : 'creatorUser';
  }


  private getConversations(){
    this._loaderService.showLoader();
    this._userConversationService.getConversations('',this.userId(), this.userTypeId())
    .pipe(finalize(() => this._loaderService.hideLoader()))
    .subscribe({
      next: (response: { conversations: UserConversationModel[]; paginator: PaginatorModel }) => {
            this.conversations = response.conversations;
            console.log('Conversations fetched:', this.conversations);
      },
      error: (error) => {
        console.error('Error fetching conversations:', error);
      }
    });
  }


  onSelectConversation(conversation: UserConversationModel): void {
    this.conversationSelected.emit(conversation);
  }
}

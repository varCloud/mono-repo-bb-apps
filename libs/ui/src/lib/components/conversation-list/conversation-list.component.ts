import { search } from 'ionicons/icons';
import { Component, EventEmitter, input, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {  LoaderUIService, UserConversationService } from '@monorepo-bb-app/core';
import { CONSTANTS, PaginatorModel, UserConversationModel } from '@monorepo-bb-app/shared';
import { ENUM_TYPE_USER } from 'libs/shared/constants/enums';
import { finalize } from 'rxjs';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';
import { EmptyElementsComponent } from '../empty-elements/empty-elements.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';



@Component({
  selector: 'app-conversation-list',
  templateUrl: './conversation-list.component.html',
  styleUrls: ['./conversation-list.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule , UserAvatarComponent, EmptyElementsComponent, TranslateModule ],
})
export class ConversationListComponent implements OnInit {
  @Output() conversationSelected = new EventEmitter<UserConversationModel>();
  @Output() conversationsList = new EventEmitter<UserConversationModel[]>();

  @Input() set searchTerm(search:string) {
      const params = { search: search?.trim()}
      this.getConversations(this._buildParams(params));
  };

  userId = input.required<number>();
  userTypeId = input.required<number>();
  public conversations: UserConversationModel[] = [];
  public userPropConversation : string = 'creatorUser'
  public imgUrl = input<string>(CONSTANTS.EMPTY_ELEMENTS_IMAGE);
  public messsageList  = 'conversations.no-conversations'
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


  private getConversations(queryParams:any = {}){
    this._loaderService.showLoader();
    this._userConversationService.getConversations('',this.userId(), this.userTypeId(), queryParams)
    .pipe(finalize(() => this._loaderService.hideLoader()))
    .subscribe({
      next: (response: { conversations: UserConversationModel[]; paginator: PaginatorModel }) => {
            this.messsageList = 'conversations.no-conversations';
            this.conversations = response.conversations;
            this.conversationsList.emit(this.conversations);
            const isSearching = !!(queryParams.search && queryParams.search.trim() !== '');
            if (!isSearching) {
                // Deriva el badge del tab desde la lista completa (fuente confiable);
                // el endpoint /unread-summary solo afina si responde correctamente.
                this._userConversationService.setUnreadSummaryFromConversations(this.conversations);
                this._userConversationService.refreshUnreadSummary();
            }
            if(isSearching && this.conversations.length === 0){
                this.messsageList = 'conversations.no-conversations-for-search';
            }
      },
      error: (error) => {
      }
    });
  }

  private _buildParams(params:any){
     const queryParams: any = {};
     if(params.search){
       queryParams.search = params.search || null;
     }     
     return queryParams;
  }


  onSelectConversation(conversation: UserConversationModel): void {
    this.conversationSelected.emit(conversation);
  }
}

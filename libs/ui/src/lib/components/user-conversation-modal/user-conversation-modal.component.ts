import { addIcons } from 'ionicons';
import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ConversationListComponent } from '../conversation-list/conversation-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { arrowBackOutline, chevronBackOutline, send, sendSharp, search } from 'ionicons/icons';
import { UserConversationService } from 'libs/core/services/user-conversation/user-conversation.services';
import { LoaderUIService } from 'libs/core/services/loader-ui.service';
import { finalize } from 'rxjs';
import { UserConversationModel } from 'libs/shared/models/user-conversation';
import { PaginatorModel } from 'libs/shared/models/paginator';
@Component({
  selector: 'app-user-conversation-modal',
  templateUrl: './user-conversation-modal.component.html',
  styleUrls: ['./user-conversation-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ConversationListComponent,
    TranslateModule,
  ],
})
export class UserConversationModalComponent implements OnInit {
  @Input() data: any; // Aquí recibiremos los datos enviados
  public search: string = '';
  constructor(private modalCtrl: ModalController
    ,private readonly _loaderService: LoaderUIService
    ,private readonly _userConversationService: UserConversationService
  ) {
     addIcons({ sendSharp , arrowBackOutline , chevronBackOutline });
  }

  ngOnInit() {
    console.log('Datos recibidos en el modal:', this.data);
  }

  dismiss(data?: any) {
    this.modalCtrl.dismiss(data);
  }

  onConversationSelected(conversation: any) {
    this.modalCtrl.dismiss({ conversation });
  }

  onSearch(event: Event) {
    const target = event.target as HTMLIonSearchbarElement;
    const query = target.value?.toLowerCase() || ''; 
    this.search = query;
  }
}

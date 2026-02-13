import { CommonModule } from '@angular/common';
import { Component, effect, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ConversationListComponent, HeaderSearchComponent, LayoutContentComponent

 } from '@monorepo-bb-app/ui';


import { ModalController, IonicModule } from '@ionic/angular';

import { Router } from '@angular/router';
import { UserConversationModalComponent } from 'libs/ui/src/lib/components/user-conversation-modal/user-conversation-modal.component';
import { SesionService } from '@monorepo-bb-app/core';
import { NgItemLabelDirective } from "@ng-select/ng-select";

@Component({
  selector: 'app-user-conversation',
  templateUrl: './user-conversation.component.html',
  styleUrls: ['./user-conversation.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutContentComponent,
    HeaderSearchComponent,
    ConversationListComponent,
    NgItemLabelDirective
],
})
export class UserConversationComponent{

  conversations: any[] = []; // Aquí definiremos el tipo correcto más adelante
  reload: boolean = true;
  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    public sesionService: SesionService
  ) {
    effect(() => {
      this.sesionService.user$()
    });
  }

  ionViewWillEnter() {
      this.reload = true;
  }

  ionViewWillLeave() {
    this.reload = false;
  }

  onConversationSelected(conversation: any) {
    this.router.navigate([`/home/${conversation.userConversationId}/user-chat`] , { state: { conversation } });
  }

  async openDetailModal(data?: any) {
    const modal = await this.modalCtrl.create({
      component: UserConversationModalComponent,
      componentProps: {
        data: {
          conversations: this.conversations,
            userId:this.sesionService.user$()?.userId,
            userTypeId: this.sesionService.user$()?.userTypeId
        },
      },
    });

    await modal.present();

    const result = await modal.onDidDismiss();
    if (result.data) {
      console.log('Modal Data:', result.data);
    }
  }
}

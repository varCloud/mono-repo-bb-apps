import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderSearchComponent, LayoutContentComponent

 } from '@monorepo-bb-app/ui';

import { ConversationListComponent } from '../../components/conversation-list/conversation-list.component';
import { ModalController, IonicModule } from '@ionic/angular';
import { UserConversationModalComponent } from '../../components/user-conversation-modal/user-conversation-modal.component';
import { Router } from '@angular/router';

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
  ],
})
export class UserConversationComponent implements OnInit, OnDestroy {

  conversations: any[] = []; // Aquí definiremos el tipo correcto más adelante

  constructor(
    private modalCtrl: ModalController,
    private router: Router,
  ) {
    // Mock data for testing
    this.conversations = [
      {
        name: 'Danny Hopkins',
        email: 'dannylove@gmail.com',
        date: '08:43',
        avatar:
          'https://bb-app-bucket-images.s3.amazonaws.com/uploads%2F75%2F1000127915.1756618728336_1756618743696_f17iz8vhqtv.jpeg',
      },
      {
        name: 'Bobby Langford',
        message: 'Super padre el entrenamiento 😊 ❤️',
        date: 'Lun',
        avatar:
          'https://bb-app-bucket-images.s3.amazonaws.com/uploads%2F75%2F1000127915.1756618728336_1756618743696_f17iz8vhqtv.jpeg',
      },
    ];
  }

  ngOnInit(): void {
    // Inicialización del componente
  }

  ngOnDestroy(): void {
    // Limpieza al destruir el componente
  }

  onConversationSelected(conversation: any) {
    // Aquí puedes manejar el evento cuando se selecciona una conversación
    console.log('Conversación seleccionada:', conversation);
    this.router.navigate(['/home/user-chat']);
  }

  async openDetailModal(data?: any) {
    const modal = await this.modalCtrl.create({
      component: UserConversationModalComponent,
      componentProps: {
        data: {
          conversations: this.conversations,
        },
      },
      breakpoints: [0, 0.25, 0.5, 0.75, 1],
    });

    await modal.present();

    const result = await modal.onDidDismiss();
    if (result.data) {
      // Manejar los datos retornados del modal si es necesario
      console.log('Modal Data:', result.data);
    }
  }
}

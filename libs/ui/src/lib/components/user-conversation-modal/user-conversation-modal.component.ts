import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ConversationListComponent } from '../conversation-list/conversation-list.component';
import { TranslateModule } from '@ngx-translate/core';

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

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    console.log('Datos recibidos en el modal:', this.data);
  }

  dismiss(data?: any) {
    this.modalCtrl.dismiss(data);
  }

  onConversationSelected(conversation: any) {
    console.log('Conversación seleccionada en el modal:', conversation);
  }

  onSearch(event: Event) {
    const target = event.target as HTMLIonSearchbarElement;
    const query = target.value?.toLowerCase() || '';
  }
}

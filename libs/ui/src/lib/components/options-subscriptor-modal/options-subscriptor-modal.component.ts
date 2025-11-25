import { Component, input, signal } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { ModalController, IonIcon, IonButton } from '@ionic/angular/standalone';
import { LoaderUIService, UserConversationService } from '@monorepo-bb-app/core';
import { addIcons } from 'ionicons';
import { chatbubbleOutline, close, closeCircleOutline, chatboxEllipsesOutline ,send, create } from 'ionicons/icons';
import { finalize, take } from 'rxjs';

// Define la interfaz de Suscripción aquí o impórtala si la tienes
// en un archivo separado.
export interface Subscription {
  id: number;
  imageUrl: string;
  name: string;
  description: string;
  tag: string;
  tagBg: string;
  tagText: string;
}

@Component({
  selector: 'lib-options-subscriptor-modal',
  templateUrl: './options-subscriptor-modal.component.html',
  styleUrls: ['./options-subscriptor-modal.component.scss'],
  standalone: true,
  imports: [IonIcon, IonButton], // Importa solo lo que necesitas
})
export class OptionsSubscritporModalComponent {

  // Recibe la suscripción seleccionada desde la página
  subscription = input.required<Subscription>();
  viewState = signal<'options' | 'confirm'>('options');

  constructor(private modalCtrl: ModalController,
    private _userConversationService:  UserConversationService,
    private _loaderUIService: LoaderUIService,
    private router: Router
  ) {
    addIcons({ closeCircleOutline , send, chatbubbleOutline , chatboxEllipsesOutline });
  }

  closeModal() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
  showConfirmView() {
    this.viewState.set('confirm');
  }
  showOptionsView() {
    this.viewState.set('options');
  }
  confirmCancellation(){
    this.modalCtrl.dismiss({ confirmed: true }, 'confirm');
  }

  sendMessage() {
    this.modalCtrl.dismiss({ createConversation:true }, 'confirm');
  }
}

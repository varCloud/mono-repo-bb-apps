import { Component, input, signal } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { ModalController, IonIcon, IonButton } from '@ionic/angular/standalone';
import { LoaderUIService, UserConversationService } from '@monorepo-bb-app/core';
import { addIcons } from 'ionicons';
import { chatbubbleOutline, close, closeCircleOutline, chatboxEllipsesOutline ,send, create, personCircleOutline } from 'ionicons/icons';
import { ENUM_TYPE_USER } from 'libs/shared/constants/enums';


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
  imports: [IonIcon, IonButton],
})
export class OptionsSubscritporModalComponent {

  //Los parametros se envian desde elcomponente padre usando componentProps
  
  userTypeId: number = ENUM_TYPE_USER.ATHLETE;
  viewState = signal<'options' | 'confirm'>('options');
  creatorSelected: number = 0;
  constructor(private modalCtrl: ModalController, private router: Router) {
    addIcons({ personCircleOutline, closeCircleOutline , send, chatbubbleOutline , chatboxEllipsesOutline });
  }

  closeModal() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  showConfirmView() {
    this.viewState.set('confirm');
  }

  showProfile() {
    this.modalCtrl.dismiss({ viewProfile: true }, 'confirm');
    this.router.navigate([`/home/suscriptions/profile-creator/${this.creatorSelected}`]);

  }

  showOptionsView() {
    this.viewState.set('options');
  }

  confirmCancellation(){
    this.modalCtrl.dismiss({ cancelSubscription: true }, 'confirm');
  }

  sendMessage() {
    this.modalCtrl.dismiss({ createConversation:true }, 'confirm');
  }

  public get enumTypeUser() {
    return ENUM_TYPE_USER;
  }
}

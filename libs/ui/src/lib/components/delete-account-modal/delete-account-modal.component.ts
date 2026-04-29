import { Component, signal } from '@angular/core';
import { ModalController, IonIcon, IonButton } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { closeCircleOutline, trash } from 'ionicons/icons';

@Component({
  selector: 'lib-delete-account-modal',
  templateUrl: './delete-account-modal.component.html',
  styleUrls: ['./delete-account-modal.component.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, TranslateModule],
})
export class DeleteAccountModalComponent {
  viewState = signal<'confirm'>('confirm');

  constructor(private modalCtrl: ModalController) {
    addIcons({ closeCircleOutline, trash });
  }

  closeModal() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  confirmDeleteAccount() {
    this.modalCtrl.dismiss({ confirmDelete: true }, 'confirm');
  }
}

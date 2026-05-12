import { Component, Input } from '@angular/core';
import { ModalController, IonButton } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-leave-app-modal',
  templateUrl: './leave-app-modal.component.html',
  styleUrls: ['./leave-app-modal.component.scss'],
  standalone: true,
  imports: [IonButton, TranslateModule],
})
export class LeaveAppModalComponent {
  @Input() url!: string;

  constructor(private modalCtrl: ModalController) {}

  continue() {
    this.modalCtrl.dismiss({ confirmed: true, url: this.url }, 'confirm');
  }

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}

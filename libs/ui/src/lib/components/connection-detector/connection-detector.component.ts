import { Component } from '@angular/core';
import {
  IonContent, IonIcon, IonText, IonButton, ModalController, IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { wifiOutline, warningOutline } from 'ionicons/icons';
import {HeaderComponent} from '@monorepo-bb-app/ui';


@Component({
  selector: 'app-no-internet',
  template:`
    <ion-content class="ion-padding no-internet-content">
      <div class="center-container">




<img src="../../../../shared/assets/images/logo-con-letras.svg" alt="Logo App" class="logo-img" />

        <ion-text color="medium">
          <h2>Hemos perdido conexion</h2>
        </ion-text>

        <p class="description">
        Revisa tu conexion a internet
        </p>

        <div class="spinner-container">
          <ion-spinner name="crescent" color="primary"></ion-spinner>
          <ion-text color="primary" class="waiting-text">Esperando red...</ion-text>
        </div>

      </div>
    </ion-content>
  `,
  styles: [`
    .no-internet-content { --background: #ffffff; }
    .logo-img {
      width: 150px;
      height: auto;
      margin-bottom: 30px;
      object-fit: contain;
    }
    .center-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 50%;
      text-align: center;
      padding: 0 20px;
    }
    .big-icon { font-size: 80px; color: var(--ion-color-medium); }
    .description { margin-bottom: 30px; line-height: 1.5; color: #666; }
    .spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }
    .waiting-text { font-size: 0.9rem; font-weight: 500; }
  `],
  standalone: true,
  imports: [IonContent, IonIcon, IonText, IonButton, IonSpinner, HeaderComponent]
})
export class ConnectionDetectorComponent {

  constructor(private modalCtrl: ModalController) {
    addIcons({ wifiOutline, warningOutline });
  }
}

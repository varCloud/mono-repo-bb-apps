import { Component } from '@angular/core';
import {
  IonContent, IonIcon, IonText, IonButton, ModalController, IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { wifiOutline, warningOutline } from 'ionicons/icons';
import {HeaderComponent} from '@monorepo-bb-app/ui';


@Component({
  selector: 'lib-connection-detector',
  templateUrl:'./connection-detector.component.html',
  styleUrls : ['./connection-detector.component.scss'],

  standalone: true,
  imports: [IonContent, IonIcon, IonText, IonButton, IonSpinner, HeaderComponent]
})
export class ConnectionDetectorComponent {

  constructor(private modalCtrl: ModalController) {
    addIcons({ wifiOutline, warningOutline });
  }
}

import { Component, OnInit } from '@angular/core';
import { LayoutContentComponent } from '@monorepo-bb-app/ui';
import { TranslateModule } from '@ngx-translate/core';
import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonAccordionGroup,
  IonAccordion,
  IonItem,
  IonLabel,
  IonIcon,
  IonChip,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  documentTextOutline,
  calendarOutline,
  informationCircle,
  videocam,
  cash,
  chatbubbles,
  warning,
  calculator,
  link,
  document,
  playCircle,
  alertCircle,
  shieldCheckmark,
  people,
  ribbon,
  checkmarkCircle,
  closeCircle,
  lockClosed,
  trash,
  helpCircle,
  codeSlash,
  shield,
  person,
  receipt,
  flag,
} from 'ionicons/icons';

@Component({
  selector: 'app-terms-conditions',
  standalone: true,
  imports: [
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonAccordionGroup,
    IonAccordion,
    IonItem,
    IonLabel,
    IonIcon,
    IonChip,
    LayoutContentComponent,
    TranslateModule,
  ],
  templateUrl: './terms-conditions.page.html',
  styleUrls: ['./terms-conditions.page.scss'],
})
export class TermsConditionsPage implements OnInit {
  constructor() {
    // Registrar todos los iconos necesarios
    addIcons({
      documentTextOutline,
      calendarOutline,
      informationCircle,
      videocam,
      cash,
      chatbubbles,
      warning,
      calculator,
      link,
      document,
      playCircle,
      alertCircle,
      shieldCheckmark,
      people,
      ribbon,
      checkmarkCircle,
      closeCircle,
      lockClosed,
      trash,
      helpCircle,
      codeSlash,
      shield,
      person,
      receipt,
      flag,
    });
  }

  ngOnInit() {}
}

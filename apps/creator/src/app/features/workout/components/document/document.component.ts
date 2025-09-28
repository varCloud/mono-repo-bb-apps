import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBackButton,
  IonButtons,
  IonGrid,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import {
  LayoutContentComponent,
  RoutineFormComponent,
  TrainingTypeEnum,
} from '@monorepo-bb-app/ui';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss'],
  standalone: true,
  imports: [
    IonGrid,
    TranslateModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonBackButton,
    IonButtons,
    LayoutContentComponent,
    RoutineFormComponent,
  ],
})
export class DocumentComponent {
  type = TrainingTypeEnum.DOCUMENT;
}

import { Component, OnInit, signal } from '@angular/core';
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
} from '@monorepo-bb-app/ui';
import { TrainingTypeEnum } from '@monorepo-bb-app/shared';

@Component({
  selector: 'app-recorded-class',
  templateUrl: './recorded-class.component.html',
  styleUrls: ['./recorded-class.component.scss'],
  standalone: true,
  imports: [
    IonGrid,
    CommonModule,
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
export class RecordedClassComponent {
  type = TrainingTypeEnum.RECORDED_CLASSES;
}

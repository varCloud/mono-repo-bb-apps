import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonCard,
  IonImg,
  IonText,
  IonLabel,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { TRAINING_TYPES } from '../../const/training-types.constants';
import { Router } from '@angular/router';

export interface TrainingType {
  id: string;
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-training-type-selection',
  templateUrl: './training-type-selection.component.html',
  styleUrls: ['./training-type-selection.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonCard,
    IonImg,
    IonText,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol,
    TranslateModule,
  ],
})
export class TrainingTypeSelectionComponent {
  constructor() {}
  @Output() typeSelected = new EventEmitter<string>();
  trainingTypes = TRAINING_TYPES;

  selectTrainingType(typeId: string) {
    this.typeSelected.emit(typeId);
  }
}

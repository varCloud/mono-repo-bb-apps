import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  IonHeader,
  IonContent,
  IonBackButton,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { RoutineFormComponent, TrainingTypeEnum } from '@monorepo-bb-app/ui';

@Component({
  selector: 'app-routine',
  templateUrl: './routine.component.html',
  styleUrls: ['./routine.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    IonHeader,
    IonContent,
    IonBackButton,
    RoutineFormComponent,
  ],
})
export class RoutineComponent implements OnInit {
  typeRoutine = signal<TrainingTypeEnum | null>(null);

  ngOnInit(): void {
    // Establecer el valor después de la inicialización
    this.typeRoutine.set(TrainingTypeEnum.ROUTINES);
  }
}

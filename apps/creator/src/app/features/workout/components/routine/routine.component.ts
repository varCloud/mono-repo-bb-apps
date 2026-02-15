import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonHeader, IonContent, IonBackButton, IonToolbar } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { RoutineFormComponent } from '@monorepo-bb-app/ui';
import { TrainingTypeEnum } from '@monorepo-bb-app/shared';

@Component({
  selector: 'app-routine',
  templateUrl: './routine.component.html',
  styleUrls: ['./routine.component.scss'],
  standalone: true,
  imports: [
    IonToolbar,
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    IonHeader,
    IonContent,
    IonBackButton,
    RoutineFormComponent,
    IonToolbar,
  ],
})
export class RoutineComponent implements OnInit {
  typeRoutine = signal<TrainingTypeEnum | null>(null);

  ngOnInit(): void {
    // Establecer el valor después de la inicialización
    this.typeRoutine.set(TrainingTypeEnum.ROUTINES);
  }
}

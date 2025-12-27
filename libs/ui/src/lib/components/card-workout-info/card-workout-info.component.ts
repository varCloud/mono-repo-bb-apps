import { Component, computed, input, output, type OnInit } from '@angular/core';
import { IonIcon, IonChip, IonLabel } from '@ionic/angular/standalone';
import { CardWithLateralImageComponent } from '../card-with-lateral-image/card-with-lateral-image.component';
import { Workout } from '@monorepo-bb-app/shared';
import { addIcons } from 'ionicons';
import { heart } from 'ionicons/icons';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { LocalStorageService } from '@monorepo-bb-app/core';

@Component({
  selector: 'lib-card-workout-info',
  imports: [IonLabel, IonChip, IonIcon, CardWithLateralImageComponent, NgClass],
  templateUrl: './card-workout-info.component.html',
  styleUrl: './card-workout-info.component.scss',
})
export class CardWorkoutInfoComponent {
  workout = input.required<Workout>();
  canClick = input<boolean>(false);
  clickEvent = output<void>();
  level = computed(() => {
    return this.workout().difficultyLevels.length > 0
      ? this.workout().difficultyLevels[0].description
      : '---';
  });

  constructor() {
    addIcons({ heart });
  }

  async onClick() {
    if (this.canClick()) {
      this.clickEvent.emit();
    }
  }
}

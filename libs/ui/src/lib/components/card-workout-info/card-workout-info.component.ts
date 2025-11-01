import { Component, computed, input, type OnInit } from '@angular/core';
import { IonIcon, IonChip, IonLabel } from '@ionic/angular/standalone';
import { CardWithLateralImageComponent } from '../card-with-lateral-image/card-with-lateral-image.component';
import { Workout } from '@monorepo-bb-app/shared';
import { addIcons } from 'ionicons';
import { heart } from 'ionicons/icons';

@Component({
  selector: 'lib-card-workout-info',
  imports: [IonLabel, IonChip, IonIcon, CardWithLateralImageComponent],
  templateUrl: './card-workout-info.component.html',
  styleUrl: './card-workout-info.component.scss',
})
export class CardWorkoutInfoComponent implements OnInit {
  workout = input.required<Workout>();
  level = computed(() => {
    return this.workout().difficultyLevels.length > 0
      ? this.workout().difficultyLevels[0].description
      : '---';
  });

  constructor() {
    addIcons({ heart });
  }
  ngOnInit(): void {}
}

import { Component, computed, input, type OnInit } from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonIcon,
  IonCardTitle,
  IonCardHeader,
} from '@ionic/angular/standalone';
import { WorkoutListModel } from '@monorepo-bb-app/shared';

@Component({
  selector: 'lib-card-max-likes',
  imports: [IonCardHeader, IonCardTitle, IonIcon, IonCardContent, IonCard],
  templateUrl: './card-max-likes.component.html',
  styleUrl: './card-max-likes.component.scss',
})
export class CardMaxLikesComponent implements OnInit {
  workout = input.required<WorkoutListModel>();
  level = computed(() => {
    return this.workout()
      .difficultyLevels.map((level: any) => level.description ?? '---')
      .sort()
      .join(', ');
  });
  ngOnInit(): void {}
}

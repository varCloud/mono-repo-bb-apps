import { Component, type OnInit, computed, input } from '@angular/core';
import { addIcons } from 'ionicons';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonCardContent,
} from '@ionic/angular/standalone';
import { heart } from 'ionicons/icons';
import { WorkoutListModel } from '@monorepo-bb-app/shared';

@Component({
  selector: 'lib-card-list',
  imports: [IonCardContent, IonIcon, IonCardTitle, IonCardHeader, IonCard],
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.scss',
})
export class CardListComponent implements OnInit {
  workout = input.required<WorkoutListModel>();
  showLevel = input<boolean>(false);
  level = computed(() => {
    return this.workout()
      .difficultyLevels.map((level: any) => level.description ?? '---')
      .sort()
      .join(', ');
  });

  constructor() {
    addIcons({ heart });
  }

  ngOnInit(): void {}
}

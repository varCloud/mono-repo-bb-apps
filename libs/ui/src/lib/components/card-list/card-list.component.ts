import {
  Component,
  type OnInit,
  computed,
  input,
  model,
  output,
} from '@angular/core';
import { addIcons } from 'ionicons';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonCardContent,
  IonButton,
  IonGrid,
  IonCol,
  IonRow,
} from '@ionic/angular/standalone';
import { book, bookmarkOutline, heart } from 'ionicons/icons';
import { WorkoutListModel } from '@monorepo-bb-app/shared';

@Component({
  selector: 'lib-card-list',
  imports: [
    IonRow,
    IonCol,
    IonGrid,
    IonCardContent,
    IonIcon,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonButton,
  ],
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

  isFavorite = model<boolean>(false);
  useBookmark = input<boolean>(false);

  clickCardEvent = output<WorkoutListModel>();
  clickFavoriteEvent = output<WorkoutListModel>();

  constructor() {
    addIcons({ heart, bookmarkOutline });
  }

  ngOnInit(): void {}

  onCardClick() {
    this.clickCardEvent.emit(this.workout());
  }

  toggleFavorite($event: Event) {
    $event.stopPropagation();
    this.isFavorite.set(!this.isFavorite());
    this.clickFavoriteEvent.emit(this.workout());
  }
}

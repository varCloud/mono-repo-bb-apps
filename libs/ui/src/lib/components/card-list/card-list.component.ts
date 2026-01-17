import {
  Component,
  type OnInit,
  computed,
  input,
  model,
  output,
  inject,
} from '@angular/core';
import { addIcons } from 'ionicons';
import {
  IonCard,
  IonCardTitle,
  IonIcon,
  IonCardContent,
  IonButton,
  IonImg,
  IonCardSubtitle,
  ModalController,
} from '@ionic/angular/standalone';
import { book, bookmarkOutline, heart, trashOutline } from 'ionicons/icons';
import { WorkoutListModel } from '@monorepo-bb-app/shared';
import { ENUM_TYPE_USER } from '../../../../../shared/constants/enums';
import { SesionService } from '@monorepo-bb-app/core';
import { DeleteWorkoutModalComponent } from '../delete-workout-modal/delete-workout-modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-card-list',
  imports: [
    CommonModule,
    IonCardContent,
    IonIcon,
    IonCardTitle,
    IonCard,
    IonButton,
    IonImg,
    IonCardSubtitle
  ],
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.scss',
})
export class CardListComponent{
  private modalCtrl = inject(ModalController);
  private sesionService = inject(SesionService);
  
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
  clickDeleteEvent = output<WorkoutListModel>();

  // Computed para validar si el usuario es creador
  isCreator = computed(() => 
    this.sesionService.user$()?.userTypeId === ENUM_TYPE_USER.CREATOR
  );

  constructor() {
    addIcons({ heart, bookmarkOutline, trashOutline });
  }

  onCardClick() {
    this.clickCardEvent.emit(this.workout());
  }

  toggleFavorite($event: Event) {
    $event.stopPropagation();
    this.isFavorite.set(!this.isFavorite());
    this.clickFavoriteEvent.emit(this.workout());
  }

  async onDeleteWorkout($event: Event) {
    $event.stopPropagation();
    
    const modal = await this.modalCtrl.create({
      component: DeleteWorkoutModalComponent,
      componentProps: {
        workout: this.workout()
      },
      cssClass: 'bottom-sheet-modal-rounded',
      breakpoints: [0, 0.5, 0.75],
      initialBreakpoint: 0.5,
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm' && data?.deleteWorkout) {
      this.clickDeleteEvent.emit(this.workout());
    }
  }
}

import { Component, type OnInit, computed, input, model, output, inject } from '@angular/core';
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
import { bookmark, bookmarkOutline, heart, trashOutline } from 'ionicons/icons';
import { ToastService, WorkoutListModel, WorkoutService } from '@monorepo-bb-app/shared';
import { ENUM_TYPE_USER, MODAL_RESPONSE } from '../../../../../shared/constants/enums';
import { SesionService } from '@monorepo-bb-app/core';
import { DeleteWorkoutModalComponent } from '../delete-workout-modal/delete-workout-modal.component';
import { CommonModule } from '@angular/common';
import { RemoveFavoriteModalComponent } from '../remove-favorite-modal.component/remove-favorite-modal.component';
import { TranslateService } from '@ngx-translate/core';

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
    IonCardSubtitle,
  ],
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.scss',
})
export class CardListComponent {
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
  isCreator = computed(() => this.sesionService.user$()?.userTypeId === ENUM_TYPE_USER.CREATOR);

  constructor(
    private modalCtrl: ModalController,
    private sesionService: SesionService,
    private _workoutService: WorkoutService,
    private _toastService: ToastService,
    private _translateService: TranslateService
  ) {
    addIcons({ heart, bookmarkOutline, trashOutline, bookmark });
  }

  onCardClick() {
    this.clickCardEvent.emit(this.workout());
  }

  toggleFavorite($event: Event) {
    $event.stopPropagation();
    this.changeFavoriteStatus(!this.isFavorite());
  }

  private changeFavoriteStatus(isFav: boolean) {
    if (!isFav) {
      this.removeFavoriteModal();
      return;
    }

    this.saveChangeFavoriteStatus(isFav);
  }

  private saveChangeFavoriteStatus(isFav: boolean) {
    const userId = this.sesionService.user$()?.userId ?? 0;
    const method = isFav ? 'saveFavorite' : 'removeFavorite';
    this.isFavorite.set(isFav);
    this._workoutService[method](userId, this.workout().workoutId).subscribe({
      next: (resp) => {
        const message = isFav
          ? 'workout.messages.favorite-added'
          : 'workout.messages.favorite-removed';
        if (isFav) {
          this._toastService.success(this._translateService.instant(message));
        } else {
          this._toastService.success(this._translateService.instant(message));
        }
        this.clickFavoriteEvent.emit(this.workout());
      },
      error: () => {
        const message = isFav
          ? 'workout.messages.favorite-not-added'
          : 'workout.messages.favorite-not-removed';
        this._toastService.error(this._translateService.instant(message));
        this.isFavorite.set(!isFav);
      },
    });
  }

  async removeFavoriteModal() {
    const modal = await this.modalCtrl.create({
      component: RemoveFavoriteModalComponent,
      componentProps: {
        workout: this.workout(),
      },
      mode: 'md',
      cssClass: 'bottom-sheet-modal-rounded',
      breakpoints: [0, 0.5, 0.75],
      initialBreakpoint: 0.6,
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === MODAL_RESPONSE.CONFIRM) {
      this.saveChangeFavoriteStatus(false);
    }
  }

  async onDeleteWorkout($event: Event) {
    $event.stopPropagation();

    const modal = await this.modalCtrl.create({
      component: DeleteWorkoutModalComponent,
      componentProps: {
        workout: this.workout(),
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

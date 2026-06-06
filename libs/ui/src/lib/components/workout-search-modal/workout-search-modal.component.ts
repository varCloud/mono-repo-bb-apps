import { ChangeDetectionStrategy, Component, effect, signal } from '@angular/core';
import {
  IonContent,
  IonSearchbar,
  ModalController,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import {
  API_URLS,
  KEY_LOCALSTORAGE,
  Paginator,
  ToastService,
  Workout,
  WorkoutService,
} from '@monorepo-bb-app/shared';
import { AppSettingsService, LoaderUIService, LocalStorageService } from '@monorepo-bb-app/core';
import { CardListComponent } from '../card-list/card-list.component';
import { CardWorkoutInfoComponent } from '../card-workout-info/card-workout-info.component';
import { Router } from '@angular/router';
import { MODAL_RESPONSE } from 'libs/shared/constants/enums';

@Component({
  selector: 'lib-workout-search-modal',
  imports: [
    IonButton,
    IonButtons,
    IonToolbar,
    IonHeader,
    IonInfiniteScrollContent,
    IonInfiniteScroll,
    IonSearchbar,
    IonContent,
    TranslateModule,
    CardListComponent,
    CardWorkoutInfoComponent,
  ],
  templateUrl: './workout-search-modal.component.html',
  styleUrl: './workout-search-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutSearchModalComponent {
  searchValue = signal<string>('');
  workouts = signal<Workout[]>([]);
  paginator = signal<Paginator>({} as Paginator);
  isInfiniteScrollDisabled = signal<boolean>(false);

  private lastSearchValue = '';

  constructor(
    private modalCtrl: ModalController,
    private _loader: LoaderUIService,
    private _workoutService: WorkoutService,
    private _toastService: ToastService,
    private _localStorage: LocalStorageService,
    private router: Router,
    private _appSettingsService: AppSettingsService
  ) {
    effect(() => {
      const value = this.searchValue();
      if (value !== this.lastSearchValue) {
        this.lastSearchValue = value;

        this.getWorkouts(undefined, { search: value }, true);
      }
    });
  }

  dismiss(data?: any) {
    this.modalCtrl.dismiss(data);
  }

  onSearch(event: Event) {
    const target = event.target as HTMLIonSearchbarElement;
    const query = target.value?.toLowerCase() || '';
    this.searchValue.set(query);
  }

  private _resolveWorkoutUrl(): string {
    const settings = this._appSettingsService.settings$();
    return settings?.onlyWorkoutSuscription === '1'
      ? API_URLS.WORKOUT_SUBSCRIBED
      : API_URLS.WORKOUT;
  }

  private async getWorkouts(url?: string, params = {}, reset = false) {
    this._loader.showLoader();
    try {
      const effectiveUrl = url ?? this._resolveWorkoutUrl();
      const res = await this._workoutService.getWorkouts(effectiveUrl, params);
      if (reset) {
        this.workouts.set(res.data);
      } else {
        this.workouts.update((current) => [...current, ...res.data]);
      }
      this.isInfiniteScrollDisabled.set(!res.paginator?.links?.next);
      this.paginator.set(res.paginator);
    } catch (error) {
      this._toastService.error('Error al cargar los entrenamientos', {
        duration: 3000,
      });
    } finally {
      this._loader.hideLoader();
    }
  }

  async onIonInfinite(event: any) {
    if (this.paginator()?.links?.next) {
      await this.getWorkouts(this.paginator().links.next as string);
    }
    event.target.complete();
  }

  async clickCard(workout: Workout) {
    const user = await this._localStorage.get(KEY_LOCALSTORAGE.USER);
    this.modalCtrl.dismiss(workout, MODAL_RESPONSE.SUCCESS);
    this.router.navigate(['home/workouts', workout.workoutId, workout.creatorId, user.userId]);
  }
}

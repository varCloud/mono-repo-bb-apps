import { Component, OnInit, signal } from '@angular/core';
import { addIcons } from 'ionicons';
import {
  barbell,
  bookmark,
  heart,
  search,
  notifications,
  filterCircleOutline,
  filterCircle,
} from 'ionicons/icons';
import {
  IonIcon,
  IonButton,
  IonContent,
  IonHeader,
  IonGrid,
  IonCol,
  IonRow,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  ModalController,
  IonBadge,
  IonInput,
  IonFab,
  IonFabButton,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import {
  CardListComponent,
  CardMaxLikesComponent,
  FilterComponent,
  OnbordingComponent,
} from '@monorepo-bb-app/ui';
import {
  FilterModel,
  KEY_LOCALSTORAGE,
  Paginator,
  ToastService,
  WorkoutListModel,
  WorkoutService,
} from '@monorepo-bb-app/shared';
import {
  LoaderUIService,
  LocalStorageService,
  ProfileColorDirective,
  SesionService,
} from '@monorepo-bb-app/core';
import { MODAL_RESPONSE } from 'libs/shared/constants/enums';
import { finalize, take } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    IonFabButton,
    IonFab,
    IonInput,
    IonBadge,
    IonInfiniteScrollContent,
    IonInfiniteScroll,
    IonRow,
    IonCol,
    IonGrid,
    IonButton,
    IonIcon,
    IonContent,
    IonHeader,
    CardListComponent,
    CardMaxLikesComponent,
    ProfileColorDirective,
  ],
})
export class HomeComponent implements OnInit {
  workouts = signal<WorkoutListModel[]>([]);
  workoutMaxLikes = signal<WorkoutListModel | null>(null);
  paginator = signal<Paginator>({} as Paginator);
  idCreator = signal<number | null>(null);
  isInfiniteScrollDisabled = signal<boolean>(false);
  filter: FilterModel = new FilterModel({
    showWorkoutTags: true,
    showLevels: true,
  });
  constructor(
    private router: Router,
    private _workoutService: WorkoutService,
    private _loader: LoaderUIService,
    private _toastService: ToastService,
    private modalCtrl: ModalController,
    private _sesionService: SesionService
  ) {
    addIcons({
      barbell,
      heart,
      bookmark,
      search,
      notifications,
      filterCircleOutline,
      filterCircle,
    });
  }

  ngOnInit(): void { }

  ionViewWillEnter() {
    this._loader.showLoader();
    setTimeout(() => {
      this.getWorkouts(undefined, true);
      this.getWorkoutMaxLikes();
    }, 1000);
  }

  private async getWorkouts(url?: string, reset = false) {
    this._loader.showLoader();
    try {
      const params = await this.getParams();
      const res = await this._workoutService.getWorkouts(url, params);
      if (reset) {
        this.workouts.set(res.data);
      } else {
        this.workouts.update((current) => [...current, ...res.data]);
      }
      this.paginator.set(res.paginator);
      this.isInfiniteScrollDisabled.set(!res.paginator?.links?.next);
    } catch (error) {
      this._toastService.error('Error al cargar los entrenamientos', {
        duration: 3000,
      });
    } finally {
      this._loader.hideLoader();
    }
  }

  private async getWorkoutMaxLikes() {
    this._loader.showLoader();
    try {
      const userId = await this.getUserId();
      this.idCreator.set(userId);
      const res = await this._workoutService.getWorkoutMaxLikes(userId);
      if (res.workoutId > 0) {
        this.workoutMaxLikes.set(res);
      }
    } catch (error) {
      this._toastService.error('Error al cargar los entrenamientos 222', {
        duration: 3000,
      });
    } finally {
      this._loader.hideLoader();
    }
  }

  onNewWorkoutClick() {
    this.router.navigate(['home/workouts']);
  }

  async onIonInfinite(event: any) {
    if (this.paginator()?.links?.next) {
      await this.getWorkouts(this.paginator().links.next as string);
    }
    event.target.complete();
  }

  public async openFilter() {
    const modal = await this.modalCtrl.create({
      component: FilterComponent,
      componentProps: {
        filter: this.filter,
      },
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === MODAL_RESPONSE.CONFIRM) {
      this.filter = data.filter;
      await this.getWorkouts(undefined, true);
    }
  }

  public onDeleteWorkout(workout: WorkoutListModel) {
    this._loader.showLoader();
    this._workoutService.deleteWorkout(workout.workoutId).pipe(
      take(1),
      finalize(() => this._loader.hideLoader())
    ).subscribe({
      next: async () => {
        this._toastService.success('workout.routine.deleted-success');
        await this.getWorkouts(undefined, true);
      },
      error: (error) => {
        this._toastService.error('workout.routine.deleted-error');
      },
    });
  }

  private async getParams() {
    const userId = await this.getUserId();
    let params = {
      creatorId: userId,
    };
    if (this.filter) {
      params = { ...params, ...this.filter.toQueryParams() };
    }
    return params;
  }

  private async getUserId() {
    let user = this._sesionService.user$();
    if (!user) {
      user = await this._sesionService.getUserFromLocalStorage();
    }

    return user?.userId || null;
  }
}

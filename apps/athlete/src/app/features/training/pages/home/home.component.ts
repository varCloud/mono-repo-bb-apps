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
  bookmarkOutline,
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
  IonImg,
  IonChip,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import {
  CardListComponent,
  CardMaxLikesComponent,
  FilterComponent,
  WorkoutSearchModalComponent,
} from '@monorepo-bb-app/ui';
import {
  CatalogsService,
  CatalogType,
  FilterModel,
  KEY_LOCALSTORAGE,
  Level,
  Paginator,
  ToastService,
  WorkoutListModel,
  WorkoutService,
} from '@monorepo-bb-app/shared';
import { LoaderUIService, LocalStorageService, SesionService } from '@monorepo-bb-app/core';
import { MODAL_RESPONSE } from 'libs/shared/constants/enums';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    IonChip,
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
    IonImg,
    TranslateModule,
  ],
})
export class HomeComponent implements OnInit {
  workouts = signal<WorkoutListModel[]>([]);
  workoutMaxLikes = signal<WorkoutListModel | null>(null);
  paginator = signal<Paginator>({} as Paginator);
  idCreator = signal<number | null>(null);
  isInfiniteScrollDisabled = signal<boolean>(false);
  workoutLevels = signal<[]>([]);
  workoutLevelSelected = signal<number | null>(null);

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
    private _localStorage: LocalStorageService,
    private _sesionService: SesionService,
    private _catalogService: CatalogsService
  ) {
    addIcons({
      barbell,
      heart,
      bookmark,
      search,
      notifications,
      filterCircleOutline,
      filterCircle,
      bookmarkOutline,
    });
  }

  ngOnInit(): void {
    this._getCatalog();
  }

  ionViewWillEnter() {
    this._loader.showLoader();
    this.getWorkouts(undefined, true);
    this.getWorkoutMaxLikes();
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

  private async getWorkoutMaxLikes() {
    this._loader.showLoader();
    try {
      let user = this._sesionService.user$();
      if (!user) {
        user = await this._sesionService.getUserFromLocalStorage();
      }
      this.idCreator.set(user?.userId || null);
      const res = await this._workoutService.getWorkoutMaxLikes(user.userId);
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

  private async getParams() {
    let params = {};
    if (this.filter) {
      params = { ...params, ...this.filter.toQueryParams() };
    }
    return params;
  }

  async clickCard(workout: WorkoutListModel) {
    const user = await this._localStorage.get(KEY_LOCALSTORAGE.USER);
    this.router.navigate(['home/workouts', workout.workoutId, workout.creatorId, user.userId]);
  }

  async openSearch() {
    const modal = await this.modalCtrl.create({
      component: WorkoutSearchModalComponent,
      breakpoints: [0, 0.25, 0.5, 0.75, 1],
    });

    await modal.present();
    const result = await modal.onWillDismiss();
  }

  private _getCatalog() {
    this._catalogService.getCatalog(CatalogType.DIFFICULTY_LEVELS).subscribe((data: any) => {
      this.workoutLevels.set(data);
    });
  }

  clearWorkoutLevelSelection() {
    this.filter.levels = [];
    this.workoutLevelSelected.set(null);
    this.getWorkouts(undefined, true);
  }
  selectWorkoutLevel(level: Level) {
    this.filter.levels = [];
    if (this.workoutLevelSelected() === level.levelId) {
      this.clearWorkoutLevelSelection();
    }
    this.workoutLevelSelected.set(level.levelId);
    this.filter.levels.push(level);
    this.getWorkouts(undefined, true);
  }
}

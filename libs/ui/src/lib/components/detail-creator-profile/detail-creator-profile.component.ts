import {
  Component,
  computed,
  input,
  output,
  signal,
  type OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { LoaderUIService, UserService } from '@monorepo-bb-app/core';
import {
  Paginator,
  ProcessSuscriptionService,
  ToastService,
  User,
  Workout,
  WorkoutService,
} from '@monorepo-bb-app/shared';
import { finalize } from 'rxjs';
import {
  IonGrid,
  IonContent,
  IonAvatar,
  IonButton,
  IonChip,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonSegmentContent,
  IonSegmentView,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from '@ionic/angular/standalone';
import { LayoutContentComponent } from '../layout-content';
import { CardWorkoutInfoComponent } from '../card-workout-info/card-workout-info.component';
import { ENUM_WORKOUT_TYPES } from '../../../../../shared/constants/enums';

@Component({
  selector: 'lib-detail-creator-profile',
  imports: [
    IonInfiniteScrollContent,
    IonInfiniteScroll,
    IonSegmentButton,
    IonSegment,
    IonLabel,
    IonChip,
    IonAvatar,
    IonContent,
    IonGrid,
    LayoutContentComponent,
    IonButton,
    IonSegmentContent,
    IonSegmentView,
    CardWorkoutInfoComponent,
  ],
  templateUrl: './detail-creator-profile.component.html',
  styleUrl: './detail-creator-profile.component.scss',
})
export class DetailCreatorProfileComponent implements OnInit {
  idCreator = input.required<number>();
  suscriptionEvent = output<boolean>();
  public tabActive = signal<string>('workouts');
  public workouts = signal<Workout[]>([]);
  public paginatorWorkouts = signal<Paginator>({} as Paginator);
  public isLoadingWorkouts = signal<boolean>(false);
  public WORKOUT_TYPES = ENUM_WORKOUT_TYPES;

  public creator = signal<User | null>(null);
  public fullName = computed(() => {
    const creator = this.creator();
    return creator ? `${creator.firstName} ${creator.lastName}` : '';
  });
  public defaultProfilePicture =
    'https://ionicframework.com/docs/img/demos/avatar.svg';

  constructor(
    private _user: UserService,
    private _router: Router,
    private _toastService: ToastService,
    private _loader: LoaderUIService,
    private _workoutService: WorkoutService,
    private _processSuscriptionService: ProcessSuscriptionService
  ) {}

  ngOnInit(): void {
    this.getCreatorProfile();
    this.getWorkoutsByCreator();
  }

  private getCreatorProfile() {
    this._loader.showLoader();
    this._user
      .getCreatorInfo(this.idCreator())
      .pipe(finalize(() => this._loader.hideLoader()))
      .subscribe({
        next: (user) => {
          this.creator.set(user);
          this._processSuscriptionService.setCreator(user);
        },
        error: (err) => {
          this._toastService.error('Failed to load creator profile.', {
            duration: 1000,
          });
        },
      });
  }

  private async getWorkoutsByCreator(url: undefined | string = undefined) {
    this.isLoadingWorkouts.set(true);
    const params = {
      creatorId: this.idCreator(),
      // workoutTypes: [
      //   ENUM_WORKOUT_TYPES.RUTINE_VIDEO,
      //   ENUM_WORKOUT_TYPES.CLASS_VIDEO,
      // ],
    };
    try {
      const workouts = await this._workoutService.getWorkouts(url, params);
      this.paginatorWorkouts.set(workouts.paginator);
      this.workouts.update((current) => [...current, ...workouts.data]);
    } catch (error) {
      this._toastService.error('Failed to load workouts.', {
        duration: 1000,
      });
    }
  }

  public changeTab(event: any) {
    this.tabActive.set(event.detail.value);
  }

  async onIonInfinite(event: any) {
    if (this.paginatorWorkouts().links.next) {
      await this.getWorkoutsByCreator(
        this.paginatorWorkouts().links.next as string
      );
      event.target.complete();
      event.target.disabled = !this.paginatorWorkouts().links.next;
    } else {
      event.target.complete();
      event.target.disabled = true;
    }
  }

  goToSuscriptionCreator() {
    this.suscriptionEvent.emit(true);
  }
}

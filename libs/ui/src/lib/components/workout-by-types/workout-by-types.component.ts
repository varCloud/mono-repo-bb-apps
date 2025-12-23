import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  signal,
  type OnInit,
} from '@angular/core';
import { Paginator, ToastService, Workout, WorkoutService } from '@monorepo-bb-app/shared';
import { ENUM_WORKOUT_TYPES } from 'libs/shared/constants/enums';
import { IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/angular/standalone';
import { CardWorkoutInfoComponent } from '../card-workout-info/card-workout-info.component';
import { ListSkeletonComponent } from '../skeleton/list-skeleton/list-skeleton.component';

@Component({
  selector: 'lib-workout-by-types',
  imports: [
    IonInfiniteScrollContent,
    IonInfiniteScroll,
    CardWorkoutInfoComponent,
    ListSkeletonComponent,
  ],
  templateUrl: './workout-by-types.component.html',
  styleUrl: './workout-by-types.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutByTypesComponent implements OnInit {
  public idCreator = input.required<number>();
  workoutTypes = input.required<ENUM_WORKOUT_TYPES[]>();
  public workouts = signal<Workout[]>([]);
  public paginatorWorkouts = signal<Paginator>({} as Paginator);
  public isLoadingWorkouts = signal<boolean>(false);
  public WORKOUT_TYPES = ENUM_WORKOUT_TYPES;

  constructor(
    private _workoutService: WorkoutService,
    private _toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.getWorkoutsByCreator();
  }

  private async getWorkoutsByCreator(url: undefined | string = undefined) {
    this.isLoadingWorkouts.set(true);
    const params = {
      creatorId: this.idCreator(),
      workoutTypes: [...this.workoutTypes()],
    };
    try {
      const workouts = await this._workoutService.getWorkouts(url, params);
      this.paginatorWorkouts.set(workouts.paginator);
      this.workouts.update((current) => [...current, ...workouts.data]);
    } catch (error) {
      this._toastService.error('Failed to load workouts.', {
        duration: 1000,
      });
    } finally {
      this.isLoadingWorkouts.set(false);
    }
  }

  async onIonInfinite(event: any) {
    if (this.paginatorWorkouts().links.next) {
      await this.getWorkoutsByCreator(this.paginatorWorkouts().links.next as string);
      event.target.complete();
      if (!this.paginatorWorkouts().links.next) {
        event.target.disabled = true;
      }
    } else {
      event.target.complete();
      event.target.disabled = true;
    }
  }
}

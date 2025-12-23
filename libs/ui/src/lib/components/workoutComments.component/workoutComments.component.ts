import { Component, input, signal, type OnInit } from '@angular/core';
import { CommentListComponent } from '../comment-list/comment-list.component';
import {
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from '@ionic/angular/standalone';
import {
  Paginator,
  ToastService,
  WorkoutService,
} from '@monorepo-bb-app/shared';
import { ListSkeletonComponent } from '../skeleton/list-skeleton/list-skeleton.component';

@Component({
  selector: 'lib-workout-comments.component',
  imports: [
    IonInfiniteScrollContent,
    IonInfiniteScroll,
    CommentListComponent,
    ListSkeletonComponent,
  ],
  templateUrl: './workoutComments.component.html',
  styleUrl: './workoutComments.component.scss',
})
export class WorkoutCommentsComponent implements OnInit {
  workoutAssetId = input.required<number>();
  public paginatorComments = signal<Paginator>({} as Paginator);
  public isLoadingComments = signal<boolean>(false);
  comments = signal<any[]>([]);

  constructor(
    private _workoutService: WorkoutService,
    private _toastService: ToastService
  ) {}

  ngOnInit(): void {}

  private async getWorkoutComments(url: undefined | string = undefined) {
    this.isLoadingComments.set(true);
    const params = {
      workoutId: this.workoutAssetId(),
    };
    try {
      const workouts = await this._workoutService.getWorkouts(url, params);
      this.paginatorComments.set(workouts.paginator);
      this.comments.update((current) => [...current, ...workouts.data]);
    } catch (error) {
      this._toastService.error('Failed to load comments.', {
        duration: 1000,
      });
    } finally {
      this.isLoadingComments.set(false);
    }
  }

  async onIonInfinite(event: any) {
    if (this.paginatorComments().links.next) {
      await this.getWorkoutComments(
        this.paginatorComments().links.next as string
      );
      event.target.complete();
      event.target.disabled = !this.paginatorComments().links.next;
    } else {
      event.target.complete();
      event.target.disabled = true;
    }
  }
}

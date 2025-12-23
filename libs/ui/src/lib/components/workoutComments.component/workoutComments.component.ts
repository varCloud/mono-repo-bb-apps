import { Component, effect, input, signal, type OnInit } from '@angular/core';
import { CommentListComponent } from '../comment-list/comment-list.component';
import {
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonIcon,
  IonText,
} from '@ionic/angular/standalone';
import { Paginator, Rating, ToastService, WorkoutService } from '@monorepo-bb-app/shared';
import { ListSkeletonComponent } from '../skeleton/list-skeleton/list-skeleton.component';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { chatbubbleEllipsesOutline } from 'ionicons/icons';

@Component({
  selector: 'lib-workout-comments',
  imports: [
    IonText,
    IonIcon,
    IonInfiniteScrollContent,
    IonInfiniteScroll,
    CommentListComponent,
    ListSkeletonComponent,
    TranslateModule,
  ],
  templateUrl: './workoutComments.component.html',
  styleUrl: './workoutComments.component.scss',
})
export class WorkoutCommentsComponent implements OnInit {
  workoutAssetId = input.required<number>();
  newComment = input<Rating | null>(null);

  paginatorComments = signal<Paginator>({} as Paginator);
  isInfiniteScrollDisabled = signal<boolean>(false);
  isLoadingComments = signal<boolean>(false);
  comments = signal<Rating[]>([]);

  constructor(
    private _workoutService: WorkoutService,
    private _toastService: ToastService
  ) {
    addIcons({ chatbubbleEllipsesOutline });
    effect(() => {
      const comment = this.newComment();
      if (comment) {
        this.comments.update((current) => {
          const exists = current.some((c) => c.ratingId === comment.ratingId);
          return exists ? current : [comment, ...current];
        });
        console.log(this.comments());
      }
    });
  }

  ngOnInit(): void {
    this.getWorkoutComments();
  }

  private async getWorkoutComments(url: undefined | string = undefined, reset = false) {
    this.isLoadingComments.set(true);
    try {
      const response = await this._workoutService.getWorkoutComments(url, this.workoutAssetId());
      this.paginatorComments.set(response.paginator);

      this.comments.update((current) => {
        const currentIds = new Set(current.map((c) => c.ratingId));
        const newComments = response.data.filter((c: any) => !currentIds.has(c.ratingId));
        return [...current, ...newComments];
      });
      this.isInfiniteScrollDisabled.set(!response.paginator.links.next);
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
      await this.getWorkoutComments(this.paginatorComments().links.next as string);
    }
    event.target.complete();
  }
}

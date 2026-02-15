import { Component, signal, ViewChild, type OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Asset,
  KEY_LOCALSTORAGE,
  Rating,
  RatingModel,
  TrainingTypeEnum,
  Workout,
  WorkoutListModel,
  WorkoutService,
} from '@monorepo-bb-app/shared';
import { addIcons } from 'ionicons';
import {
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonText,
  IonContent,
  IonHeader,
  IonBackButton,
  IonItemDivider,
  IonFab,
  ModalController,
  IonButtons
} from '@ionic/angular/standalone';
import {
  arrowBackOutline,
  bookmark,
  bookmarkOutline,
  heart,
  heartOutline,
  star,
  starOutline,
} from 'ionicons/icons';
import {
  WorkoutInformationTimeLikesComents,
  SubmitReviewComponent,
  YoutubeVideoComponent,
  CustomVideoPlayerComponent,
  ViewPdfComponent,
  WorkoutCommentsComponent,
} from '@monorepo-bb-app/ui';
import { TranslateModule } from '@ngx-translate/core';
import { MODAL_RESPONSE } from 'libs/shared/constants/enums';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ActionsWorkoutService, LocalStorageService, SesionService } from '@monorepo-bb-app/core';

@Component({
  selector: 'app-detail-workout-asset',
  imports: [
    IonFab,
    IonItemDivider,
    IonBackButton,
    IonText,
    IonIcon,
    IonCol,
    IonRow,
    IonGrid,
    IonButton,
    WorkoutInformationTimeLikesComents,
    IonContent,
    IonHeader,
    TranslateModule,
    PdfViewerModule,
    YoutubeVideoComponent,
    CustomVideoPlayerComponent,
    ViewPdfComponent,
    WorkoutCommentsComponent,
    IonButtons
  ],
  templateUrl: './detail-workout-asset.html',
  styleUrl: './detail-workout-asset.scss',
})
export class DetailWorkoutAsset implements OnInit {
  @ViewChild(YoutubeVideoComponent)
  youtubeVideoComponent: YoutubeVideoComponent;
  @ViewChild(CustomVideoPlayerComponent)
  customVideoPlayerComponent: CustomVideoPlayerComponent;

  isYoutube = signal<boolean>(false);
  isRoutine = signal<boolean>(false);
  isDocument = signal<boolean>(false);
  isPlaying = signal<boolean>(false);
  isFavorite = signal<boolean>(false);
  isLiked = signal<boolean>(false);
  rating = signal<RatingModel | null>(null);
  workout = this._activatedRoute.snapshot.data['workout'] as Workout;
  workoutAssetId = this._activatedRoute.snapshot.paramMap.get('workoutAssetIdP');

  url = signal<string | null>('');
  tituloVideo = signal<string>('');
  descripcion = signal<string>('');

  workoutAsset = signal<Asset | null>(null);
  latestComment = signal<Rating | null>(null);
  constructor(
    private _activatedRoute: ActivatedRoute,
    private modalCtrl: ModalController,
    private _localStorage: LocalStorageService,
    private _workoutService: WorkoutService,
    private _sesionService: SesionService,
    private _actionsWorkoutService: ActionsWorkoutService
  ) {
    addIcons({
      heart,
      heartOutline,
      bookmark,
      bookmarkOutline,
      star,
      starOutline,
      arrowBackOutline,
    });
  }

  ngOnInit(): void {
    const asset = this.workout.assets.find(
      (asset) => asset.workoutAssetId === +this.workoutAssetId
    );
    if (asset && (asset.signedUrl || asset.assetUrl)) {
      this.workoutAsset.set(asset);

      this.isYoutube.set(this.workout.workoutTypeId === TrainingTypeEnum.RECORDED_CLASSES);
      this.isRoutine.set(this.workout.workoutTypeId === TrainingTypeEnum.ROUTINES);
      this.isDocument.set(this.workout.workoutTypeId === TrainingTypeEnum.DOCUMENT);

      if (this.isRoutine()) {
        this.url.set(asset.signedUrl || '');
      }

      if (this.isDocument()) {
        this.url.set(
          asset.signedUrl || 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf'
        );
      }
      if (this.isYoutube()) {
        this.url.set(asset.assetUrl);
      }

      this.tituloVideo.set(asset.name);
      this.descripcion.set(asset.description || '');
    }
  }

  ionViewWillEnter() {
    this.checkFavorite();
    this.checkLike();
    this.checkrating();
  }

  async checkFavorite() {
    const favorites = await this._localStorage.get(KEY_LOCALSTORAGE.FAVORITES);
    const isFavorite = favorites?.includes(this.workout.workoutId);
    if (isFavorite) {
      this.isFavorite.set(true);
      return;
    }

    const user = this._sesionService.user$();
    if (!user) return;
    this._actionsWorkoutService.getOnlyidsFavoritesByUser(user.userId).subscribe({
      next: (res) => {
        const updatedFavorites = res.data;
        this.isFavorite.set(updatedFavorites?.includes(this.workout.workoutId));
      },
      error: () => {
        this.isFavorite.set(false);
      },
    });
  }

  async checkLike() {
    const liked = await this._actionsWorkoutService.checkLike(this.workout.workoutId);
    this.isLiked.set(liked);
  }

  checkrating() {
    this._workoutService
      .getRatingByWorkoutAssetandUser(+this.workoutAssetId!, this._sesionService.user$()?.userId!)
      .subscribe({
        next: (data) => {
          this.rating.set(new RatingModel(data));
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  ionViewWillLeave() {
    this.youtubeVideoComponent?.destroy();
    this.customVideoPlayerComponent?.destroy();
  }

  playVideo() {
    this.isPlaying.update((value) => !value);
  }

  public async openReview() {
    (document.activeElement as HTMLElement)?.blur();
    const modal = await this.modalCtrl.create({
      component: SubmitReviewComponent,
      componentProps: {
        userId: this.workout.creatorId,
        workoutAssetId: this.workoutAssetId,
        rating: this.rating(),
      },
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === MODAL_RESPONSE.SUCCESS) {
      this.latestComment.set(data);
      this.rating.set(data);
    }
  }

  async toggleFavorite() {
    try {
      if (this.isFavorite()) {
        await this._actionsWorkoutService.removeFavoriteModal(this.workout as WorkoutListModel);
        this.isFavorite.set(false);
        return;
      }
      await this._actionsWorkoutService.saveChangeFavoriteStatus(true, this.workout.workoutId);
      this.isFavorite.set(true);
    } catch (error) {
      console.error('Error toggling favorite status:', error);
    }
  }

  async toggleLike() {
    try {
      const newLikeStatus = !this.isLiked();
      await this._actionsWorkoutService.changeStatusLikeWorkout(
        newLikeStatus,
        this.workout.workoutId
      );
      this.isLiked.set(newLikeStatus);
    } catch (error) {
      console.error('Error toggling like status:', error);
    }
  }
}

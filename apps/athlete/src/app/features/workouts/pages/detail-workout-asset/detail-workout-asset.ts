import { Component, signal, ViewChild, type OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Asset, Rating, TrainingTypeEnum, Workout } from '@monorepo-bb-app/shared';
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

  workout = this._activatedRoute.snapshot.data['workout'] as Workout;
  workoutAssetId = this._activatedRoute.snapshot.paramMap.get('workoutAssetIdP');

  url = signal<string | null>('');
  tituloVideo = signal<string>('');
  descripcion = signal<string>('');

  workoutAsset = signal<Asset | null>(null);
  latestComment = signal<Rating | null>(null);

  constructor(
    private _activatedRoute: ActivatedRoute,
    private modalCtrl: ModalController
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
      },
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === MODAL_RESPONSE.SUCCESS) {
      this.latestComment.set(data);
    }
  }
}

import {
  Component,
  ElementRef,
  signal,
  ViewChild,
  type OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Asset, Workout, WorkoutService } from '@monorepo-bb-app/shared';
import * as PlyrModule from 'plyr';
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
  CommentListComponent,
  Comment,
  SubmitReviewComponent,
} from '@monorepo-bb-app/ui';
import { TranslateModule } from '@ngx-translate/core';
import { Capacitor } from '@capacitor/core';
import { StatusBar } from '@capacitor/status-bar';
import { MODAL_RESPONSE } from 'libs/shared/constants/enums';
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
    CommentListComponent,
    TranslateModule,
  ],
  templateUrl: './detail-workout-asset.html',
  styleUrl: './detail-workout-asset.scss',
})
export class DetailWorkoutAsset implements OnInit {
  @ViewChild('player') videoElement: ElementRef;
  workout = this._activatedRoute.snapshot.data['workout'] as Workout;
  workoutAssetId =
    this._activatedRoute.snapshot.paramMap.get('workoutAssetIdP');
  player: Plyr;

  videoUrl = signal<string | null>('');
  tituloVideo = signal<string>('');
  descripcion = signal<string>('');

  workoutAsset = signal<Asset | null>(null);
  //TODO: Se quitaran cuando se regresen los comentarios desde el backend
  comments = signal<Comment[]>([
    {
      id: 1,
      author: {
        name: 'María García',
        avatar: 'https://ionicframework.com/docs/img/demos/avatar.svg',
      },
      text: '¡Excelente rutina! Me ha ayudado mucho a mejorar mi técnica.',
      timeAgo: '2024-01-15',
      rating: 4,
    },
    {
      id: 2,
      author: {
        name: 'Carlos Rodríguez',
        avatar: 'https://ionicframework.com/docs/img/demos/avatar.svg',
      },
      text: 'Los ejercicios están muy bien explicados. Definitivamente los voy a incluir en mi entrenamiento.',
      timeAgo: '2024-01-14',
      rating: 5,
    },
    {
      id: 3,
      author: {
        name: 'Ana Martínez',
        avatar: 'https://ionicframework.com/docs/img/demos/avatar.svg',
      },
      text: '¿Cuántas veces a la semana recomiendan hacer esta rutina?',
      timeAgo: '2024-01-13',
      rating: 2,
    },
    {
      id: 5,
      author: {
        name: 'Ana Martínez',
        avatar: 'https://ionicframework.com/docs/img/demos/avatar.svg',
      },
      text: '¿Cuántas veces a la semana recomiendan hacer esta rutina?',
      timeAgo: '2024-01-13',
      rating: 2,
    },
    {
      id: 3,
      author: {
        name: 'Ana Martínez',
        avatar: 'https://ionicframework.com/docs/img/demos/avatar.svg',
      },
      text: '¿Cuántas veces a la semana recomiendan hacer esta rutina?',
      timeAgo: '2024-01-13',
      rating: 2,
    },
  ]);

  constructor(
    private workoutService: WorkoutService,
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
    const video = this.workout.assets.find(
      (asset) => asset.workoutAssetId === +this.workoutAssetId
    );
    if (video && video.signedUrl) {
      this.videoUrl.set(video.signedUrl);
      this.tituloVideo.set(video.name);
      this.descripcion.set(video.description || '');
      this.workoutAsset.set(video);
    }
  }

  ngOnDestroy(): void {
    this.player.destroy();
  }

  ionViewWillLeave() {
    this.player.destroy();
  }

  ngAfterViewInit() {
    this.player = new PlyrModule.default(this.videoElement.nativeElement, {
      ratio: '1:1',
      hideControls: true,
      clickToPlay: true,

      controls: [
        'play-large', // The large play button in the center
        // 'restart', // Restart playback
        'rewind', // Rewind by the seek time (default 10 seconds)
        'play', // Play/pause playback
        'fast-forward', // Fast forward by the seek time (default 10 seconds)
        'progress', // The progress bar and scrubber for playback and buffering
        'current-time', // The current time of playback
        'duration', // The full duration of the media
        // 'mute', // Toggle mute
        // 'volume', // Volume control
        // 'captions', // Toggle captions
        'fullscreen', // Toggle fullscreen
        'settings', // Settings menu
        // 'pip', // Picture-in-picture (currently Safari only)
        // 'airplay', // Airplay (currently Safari only)
      ],
    });

    this.player.on('exitfullscreen', async () => {
      if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios') {
        await StatusBar.setOverlaysWebView({ overlay: true });
        await StatusBar.show();
      }
    });
  }

  playVideo() {
    if (this.player?.playing) {
      this.player.pause();
      return;
    }
    this.player.play();
  }

  public async openReview() {
    const modal = await this.modalCtrl.create({
      component: SubmitReviewComponent,
      componentProps: {
        coachName: 'Hola munod',
        avatarUrl: '',
      },
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === MODAL_RESPONSE.CONFIRM) {
    }
  }
}

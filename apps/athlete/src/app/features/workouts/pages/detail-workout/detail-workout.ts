import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  signal,
  ViewChild,
  type OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  IonButton,
  IonGrid,
  IonCol,
  IonRow,
  IonContent,
  IonBackButton,
  IonText,
  IonIcon,
} from '@ionic/angular/standalone';
import { LayoutContentComponent } from '@monorepo-bb-app/ui';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';
import * as PlyrModule from 'plyr';

@Component({
  selector: 'app-detail-workout',
  imports: [
    IonIcon,
    IonText,
    IonBackButton,
    IonContent,
    IonRow,
    IonCol,
    IonGrid,
    IonButton,
    LayoutContentComponent,
    TranslateModule,
  ],
  templateUrl: './detail-workout.html',
  styleUrl: './detail-workout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailWorkout implements OnInit {
  @ViewChild('player') videoElement: ElementRef<HTMLVideoElement>;
  isFavorite = signal<boolean>(false);
  data = this.activatedRoute.snapshot.data['workout'];
  player: Plyr;
  videoUrl = this.data.assets[0].signedUrl || null;
  constructor(private activatedRoute: ActivatedRoute) {
    addIcons({ heart, heartOutline });
  }
  ngOnInit(): void {
    console.log(this.videoUrl, this.data);
  }

  toggleFavorite($event: Event) {
    this.isFavorite.set(!this.isFavorite());
  }

  ngAfterViewInit() {
    this.player = new PlyrModule.default(this.videoElement.nativeElement, {
      ratio: '1:1',
      hideControls: true,
      clickToPlay: true,
      playsinline: true,
      controls: [
        'play-large', // The large play button in the center
        // 'restart', // Restart playback
        'rewind', // Rewind by the seek time (default 10 seconds)
        'play', // Play/pause playback
        'fast-forward', // Fast forward by the seek time (default 10 seconds)
        'progress', // The progress bar and scrubber for playback and buffering
        'current-time', // The current time of playback
        'duration', // The full duration of the media
        'mute', // Toggle mute
        // 'volume', // Volume control
        // 'captions', // Toggle captions
        'fullscreen', // Toggle fullscreen
        'settings', // Settings menu
        // 'pip', // Picture-in-picture (currently Safari only)
        // 'airplay', // Airplay (currently Safari only)
      ],
    } as any);
  }
}

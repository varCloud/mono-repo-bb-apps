import {
  Component,
  ElementRef,
  signal,
  ViewChild,
  type OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Workout, WorkoutService } from '@monorepo-bb-app/shared';
import * as PlyrModule from 'plyr';
@Component({
  selector: 'app-detail-workout-asset',
  imports: [],
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

  constructor(
    private workoutService: WorkoutService,
    private _activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const video = this.workout.assets.find(
      (asset) => asset.workoutAssetId === +this.workoutAssetId
    );
    if (video && video.signedUrl) {
      this.videoUrl.set(video.signedUrl);
      this.tituloVideo.set(video.name);
      this.descripcion.set(video.description || '');
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
  }
}

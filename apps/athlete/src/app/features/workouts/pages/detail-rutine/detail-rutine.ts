import { Component, ElementRef, ViewChild, type OnInit } from '@angular/core';
import { WorkoutService } from '@monorepo-bb-app/shared';
import * as PlyrModule from 'plyr';
@Component({
  selector: 'app-detail-rutine',
  imports: [],
  templateUrl: './detail-rutine.html',
  styleUrl: './detail-rutine.scss',
})
export class DetailRutine implements OnInit {
  @ViewChild('player') videoElement: ElementRef;

  player: Plyr;

  // ESTA URL DEBE VENIR DE TU BACKEND (Ver sección de Seguridad abajo)
  videoUrl =
    'https://bb-app-bucket.s3.amazonaws.com/uploads/107/691f9d9b31502749ed25b1f0/VID_20251120_170324_1763683521528_i4j1s82tobh.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAUQKGH4ZXZCMXSLHU%2F20251121%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251121T010353Z&X-Amz-Expires=3600&X-Amz-Signature=7feb2f11891b019679f5162ac27e7217cbdf64dc336357253b8543d4f5d14f26&X-Amz-SignedHeaders=host';
  tituloVideo = 'Entrenamiento de Fuerza';
  descripcion = 'Rutina completa de 30 minutos.';
  constructor(private workoutService: WorkoutService) {}

  ngOnInit(): void {
    this.workoutService.getWorkoutById(61).then((workout) => {
      console.log('Workout loaded:', workout);
    });
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
        'mute', // Toggle mute
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

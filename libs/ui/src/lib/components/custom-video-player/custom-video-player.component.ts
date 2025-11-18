import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  OnInit,
  OnDestroy,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonButton,
  IonIcon,
  IonRange,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  play,
  pause,
  volumeHigh,
  volumeMute,
  expand,
  contract,
  playBack,
  playForward,
} from 'ionicons/icons';

@Component({
  selector: 'lib-custom-video-player',
  templateUrl: './custom-video-player.component.html',
  styleUrls: ['./custom-video-player.component.scss'],
  standalone: true,
  imports: [CommonModule, IonButton, IonIcon, IonRange, IonSpinner],
})
export class CustomVideoPlayerComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement', { static: true })
  videoElement!: ElementRef<HTMLVideoElement>;

  @Input() videoUrl = '';
  @Input() poster = '';
  @Input() autoplay = false;

  @Output() onPlay = new EventEmitter<void>();
  @Output() onPause = new EventEmitter<void>();
  @Output() onEnded = new EventEmitter<void>();
  @Output() onTimeUpdate = new EventEmitter<number>();

  // Signals
  isPlaying = signal(false);
  isLoading = signal(true);
  hasError = signal(false);
  currentTime = signal(0);
  duration = signal(0);
  volume = signal(100);
  isMuted = signal(false);
  isFullscreen = signal(false);
  showControls = signal(true);
  playbackRate = signal(1);

  private hideControlsTimeout: any;
  public video!: HTMLVideoElement;

  constructor() {
    addIcons({
      play,
      pause,
      volumeHigh,
      volumeMute,
      expand,
      contract,
      playBack,
      playForward,
    });
  }

  ngOnInit() {
    this.video = this.videoElement.nativeElement;
    this.setupVideoListeners();

    if (this.autoplay) {
      this.togglePlay();
    }
  }

  ngOnDestroy() {
    this.removeVideoListeners();
    if (this.hideControlsTimeout) {
      clearTimeout(this.hideControlsTimeout);
    }
  }

  private setupVideoListeners() {
    this.video.addEventListener('loadedmetadata', this.onLoadedMetadata);
    this.video.addEventListener('timeupdate', this.onVideoTimeUpdate);
    this.video.addEventListener('play', this.onVideoPlay);
    this.video.addEventListener('pause', this.onVideoPause);
    this.video.addEventListener('ended', this.onVideoEnded);
    this.video.addEventListener('error', this.onVideoError);
    this.video.addEventListener('waiting', this.onVideoWaiting);
    this.video.addEventListener('canplay', this.onVideoCanPlay);
  }

  private removeVideoListeners() {
    this.video.removeEventListener('loadedmetadata', this.onLoadedMetadata);
    this.video.removeEventListener('timeupdate', this.onVideoTimeUpdate);
    this.video.removeEventListener('play', this.onVideoPlay);
    this.video.removeEventListener('pause', this.onVideoPause);
    this.video.removeEventListener('ended', this.onVideoEnded);
    this.video.removeEventListener('error', this.onVideoError);
    this.video.removeEventListener('waiting', this.onVideoWaiting);
    this.video.removeEventListener('canplay', this.onVideoCanPlay);
  }

  private onLoadedMetadata = () => {
    this.duration.set(this.video.duration);
    this.isLoading.set(false);
  };

  private onVideoTimeUpdate = () => {
    this.currentTime.set(this.video.currentTime);
    this.onTimeUpdate.emit(this.video.currentTime);
  };

  private onVideoPlay = () => {
    this.isPlaying.set(true);
    this.onPlay.emit();
  };

  private onVideoPause = () => {
    this.isPlaying.set(false);
    this.onPause.emit();
  };

  private onVideoEnded = () => {
    this.isPlaying.set(false);
    this.onEnded.emit();
  };

  private onVideoError = () => {
    this.isLoading.set(false);
    this.hasError.set(true);
  };

  private onVideoWaiting = () => {
    this.isLoading.set(true);
  };

  private onVideoCanPlay = () => {
    this.isLoading.set(false);
  };

  togglePlay() {
    if (this.video.paused) {
      this.video.play().catch((error) => {
        console.error('Error playing video:', error);
        this.hasError.set(true);
      });
    } else {
      this.video.pause();
    }
    this.resetHideControlsTimer();
  }

  seek(event: any) {
    const time = event.detail.value;
    this.video.currentTime = time;
    this.currentTime.set(time);
    this.resetHideControlsTimer();
  }

  skipTime(seconds: number) {
    this.video.currentTime = Math.max(
      0,
      Math.min(this.video.currentTime + seconds, this.video.duration)
    );
    this.resetHideControlsTimer();
  }

  changeVolume(event: any) {
    const vol = event.detail.value;
    this.volume.set(vol);
    this.video.volume = vol / 100;
    this.isMuted.set(vol === 0);
    this.resetHideControlsTimer();
  }

  toggleMute() {
    if (this.isMuted()) {
      this.video.volume = this.volume() / 100;
      this.isMuted.set(false);
    } else {
      this.video.volume = 0;
      this.isMuted.set(true);
    }
    this.resetHideControlsTimer();
  }

  changePlaybackRate() {
    const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(this.playbackRate());
    const nextIndex = (currentIndex + 1) % rates.length;
    const newRate = rates[nextIndex];
    this.playbackRate.set(newRate);
    this.video.playbackRate = newRate;
    this.resetHideControlsTimer();
  }

  async toggleFullscreen() {
    try {
      if (!this.isFullscreen()) {
        if (this.video.requestFullscreen) {
          await this.video.requestFullscreen();
        } else if ((this.video as any).webkitEnterFullscreen) {
          // iOS Safari
          (this.video as any).webkitEnterFullscreen();
        } else if ((this.video as any).mozRequestFullScreen) {
          await (this.video as any).mozRequestFullScreen();
        } else if ((this.video as any).msRequestFullscreen) {
          await (this.video as any).msRequestFullscreen();
        }
        this.isFullscreen.set(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          (document as any).msExitFullscreen();
        }
        this.isFullscreen.set(false);
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
    this.resetHideControlsTimer();
  }

  onVideoClick() {
    this.togglePlay();
  }

  onControlsAreaClick(event: Event) {
    event.stopPropagation();
    this.showControls.set(true);
    this.resetHideControlsTimer();
  }

  private resetHideControlsTimer() {
    this.showControls.set(true);
    if (this.hideControlsTimeout) {
      clearTimeout(this.hideControlsTimeout);
    }

    if (this.isPlaying()) {
      this.hideControlsTimeout = setTimeout(() => {
        this.showControls.set(false);
      }, 3000);
    }
  }

  formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  get progressPercentage(): number {
    return (this.currentTime() / this.duration()) * 100 || 0;
  }
}


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
  alertCircle,
} from 'ionicons/icons';

/** Tiempo en ms para ocultar los controles automáticamente */
const HIDE_CONTROLS_DELAY = 3000;

/** Velocidades de reproducción disponibles */
const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2];

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

  @ViewChild('playerContainer', { static: true })
  playerContainer!: ElementRef<HTMLDivElement>;

  // ─────────────────────────────────────────────────────────────────────────────
  // INPUTS
  // ─────────────────────────────────────────────────────────────────────────────
  @Input() videoUrl = '';
  @Input() poster = '';
  @Input() autoplay = false;

  // ─────────────────────────────────────────────────────────────────────────────
  // OUTPUTS
  // ─────────────────────────────────────────────────────────────────────────────
  @Output() videoPlay = new EventEmitter<void>();
  @Output() videoPause = new EventEmitter<void>();
  @Output() videoEnded = new EventEmitter<void>();
  @Output() timeUpdate = new EventEmitter<number>();

  // ─────────────────────────────────────────────────────────────────────────────
  // SIGNALS - Estado del reproductor
  // ─────────────────────────────────────────────────────────────────────────────
  readonly isPlaying = signal(false);
  readonly isLoading = signal(true);
  readonly hasError = signal(false);
  readonly currentTime = signal(0);
  readonly duration = signal(0);
  readonly volume = signal(100);
  readonly isMuted = signal(false);
  readonly isFullscreen = signal(false);
  readonly showControls = signal(true);
  readonly playbackRate = signal(1);

  // ─────────────────────────────────────────────────────────────────────────────
  // PRIVATE PROPERTIES
  // ─────────────────────────────────────────────────────────────────────────────
  private hideControlsTimeout: ReturnType<typeof setTimeout> | null = null;
  public video!: HTMLVideoElement;

  constructor() {
    this.registerIcons();
  }

  /** Registra los iconos de Ionicons necesarios */
  private registerIcons(): void {
    addIcons({
      play,
      pause,
      volumeHigh,
      volumeMute,
      expand,
      contract,
      playBack,
      playForward,
      alertCircle,
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // LIFECYCLE HOOKS
  // ═══════════════════════════════════════════════════════════════════════════

  ngOnInit(): void {
    this.video = this.videoElement.nativeElement;
    this.setupVideoListeners();
    this.setupFullscreenListeners();

    if (this.autoplay) {
      this.play();
    }
  }

  ngOnDestroy(): void {
    this.removeVideoListeners();
    this.removeFullscreenListeners();
    this.clearHideControlsTimer();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // VIDEO EVENT LISTENERS
  // ═══════════════════════════════════════════════════════════════════════════

  private setupVideoListeners(): void {
    const events = [
      ['loadedmetadata', this.handleLoadedMetadata],
      ['timeupdate', this.handleTimeUpdate],
      ['play', this.handlePlay],
      ['pause', this.handlePause],
      ['ended', this.handleEnded],
      ['error', this.handleError],
      ['waiting', this.handleWaiting],
      ['canplay', this.handleCanPlay],
    ] as const;

    events.forEach(([event, handler]) => {
      this.video.addEventListener(event, handler);
    });
  }

  private removeVideoListeners(): void {
    const events = [
      ['loadedmetadata', this.handleLoadedMetadata],
      ['timeupdate', this.handleTimeUpdate],
      ['play', this.handlePlay],
      ['pause', this.handlePause],
      ['ended', this.handleEnded],
      ['error', this.handleError],
      ['waiting', this.handleWaiting],
      ['canplay', this.handleCanPlay],
    ] as const;

    events.forEach(([event, handler]) => {
      this.video.removeEventListener(event, handler);
    });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Event Handlers (arrow functions para mantener contexto)
  // ─────────────────────────────────────────────────────────────────────────────

  private handleLoadedMetadata = (): void => {
    this.duration.set(this.video.duration);
    this.isLoading.set(false);
  };

  private handleTimeUpdate = (): void => {
    this.currentTime.set(this.video.currentTime);
    this.timeUpdate.emit(this.video.currentTime);
  };

  private handlePlay = (): void => {
    this.isPlaying.set(true);
    this.videoPlay.emit();
    this.startHideControlsTimer();
  };

  private handlePause = (): void => {
    this.isPlaying.set(false);
    this.videoPause.emit();
    this.showControls.set(true);
    this.clearHideControlsTimer();
  };

  private handleEnded = (): void => {
    this.isPlaying.set(false);
    this.videoEnded.emit();
    this.showControls.set(true);
  };

  private handleError = (): void => {
    this.isLoading.set(false);
    this.hasError.set(true);
  };

  private handleWaiting = (): void => {
    this.isLoading.set(true);
  };

  private handleCanPlay = (): void => {
    this.isLoading.set(false);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // PLAYBACK CONTROLS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Alterna entre reproducir y pausar */
  togglePlay(): void {
    this.video.paused ? this.play() : this.pause();
  }

  /** Inicia la reproducción del video */
  play(): void {
    this.video.play().catch((error) => {
      console.error('Error al reproducir video:', error);
      this.hasError.set(true);
    });
  }

  /** Pausa la reproducción del video */
  pause(): void {
    this.video.pause();
  }

  /** Salta a un tiempo específico del video */
  seek(event: CustomEvent): void {
    const time = event.detail.value as number;
    this.video.currentTime = time;
    this.currentTime.set(time);
    this.resetHideControlsTimer();
  }

  /** Avanza o retrocede el video X segundos */
  skipTime(seconds: number): void {
    const newTime = this.video.currentTime + seconds;
    const clampedTime = Math.max(0, Math.min(newTime, this.video.duration));
    this.video.currentTime = clampedTime;
    this.resetHideControlsTimer();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // VOLUME CONTROLS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Cambia el volumen del video */
  changeVolume(event: CustomEvent): void {
    const volumeValue = event.detail.value as number;
    this.volume.set(volumeValue);
    this.video.volume = volumeValue / 100;
    this.isMuted.set(volumeValue === 0);
    this.resetHideControlsTimer();
  }

  /** Activa/desactiva el silencio */
  toggleMute(): void {
    const shouldUnmute = this.isMuted();
    this.video.volume = shouldUnmute ? this.volume() / 100 : 0;
    this.isMuted.set(!shouldUnmute);
    this.resetHideControlsTimer();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PLAYBACK RATE & FULLSCREEN
  // ═══════════════════════════════════════════════════════════════════════════

  /** Configura los listeners para detectar cambios de fullscreen */
  private setupFullscreenListeners(): void {
    document.addEventListener('fullscreenchange', this.handleFullscreenChange);
    document.addEventListener(
      'webkitfullscreenchange',
      this.handleFullscreenChange
    );
    document.addEventListener(
      'mozfullscreenchange',
      this.handleFullscreenChange
    );
    document.addEventListener(
      'MSFullscreenChange',
      this.handleFullscreenChange
    );
  }

  /** Remueve los listeners de fullscreen */
  private removeFullscreenListeners(): void {
    document.removeEventListener(
      'fullscreenchange',
      this.handleFullscreenChange
    );
    document.removeEventListener(
      'webkitfullscreenchange',
      this.handleFullscreenChange
    );
    document.removeEventListener(
      'mozfullscreenchange',
      this.handleFullscreenChange
    );
    document.removeEventListener(
      'MSFullscreenChange',
      this.handleFullscreenChange
    );
  }

  /** Handler para cambios de fullscreen - sincroniza el estado */
  private handleFullscreenChange = (): void => {
    const isCurrentlyFullscreen = this.isDocumentFullscreen();
    this.isFullscreen.set(isCurrentlyFullscreen);
  };

  /** Verifica si el documento está actualmente en fullscreen */
  private isDocumentFullscreen(): boolean {
    const doc = document as any;
    return !!(
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement
    );
  }

  /** Cambia la velocidad de reproducción al siguiente valor disponible */
  changePlaybackRate(): void {
    const currentIndex = PLAYBACK_RATES.indexOf(this.playbackRate());
    const nextIndex = (currentIndex + 1) % PLAYBACK_RATES.length;
    const newRate = PLAYBACK_RATES[nextIndex];

    this.playbackRate.set(newRate);
    this.video.playbackRate = newRate;
    this.resetHideControlsTimer();
  }

  /** Activa/desactiva el modo pantalla completa */
  async toggleFullscreen(): Promise<void> {
    try {
      // Verificar el estado REAL del fullscreen, no el del signal
      const isCurrentlyFullscreen = this.isDocumentFullscreen();

      if (isCurrentlyFullscreen) {
        await this.exitFullscreen();
      } else {
        await this.enterFullscreen();
      }
    } catch (error) {
      console.error('Error al cambiar pantalla completa:', error);
    }
    this.resetHideControlsTimer();
  }

  private async enterFullscreen(): Promise<void> {
    // Usar el contenedor para fullscreen (incluye controles)
    const container = this.playerContainer?.nativeElement;

    // Verificar que el elemento está conectado al DOM
    if (!container || !container.isConnected) {
      console.warn('El contenedor no está conectado al DOM');
      return;
    }

    const el = container as any;

    if (el.requestFullscreen) {
      await el.requestFullscreen();
    } else if (el.webkitRequestFullscreen) {
      await el.webkitRequestFullscreen();
    } else if (el.webkitEnterFullscreen) {
      el.webkitEnterFullscreen(); // iOS Safari
    } else if (el.mozRequestFullScreen) {
      await el.mozRequestFullScreen();
    } else if (el.msRequestFullscreen) {
      await el.msRequestFullscreen();
    }
  }

  private async exitFullscreen(): Promise<void> {
    // Verificar que realmente estamos en fullscreen antes de intentar salir
    if (!this.isDocumentFullscreen()) {
      this.isFullscreen.set(false);
      return;
    }

    const doc = document as any;

    if (doc.exitFullscreen) {
      await doc.exitFullscreen();
    } else if (doc.webkitExitFullscreen) {
      doc.webkitExitFullscreen();
    } else if (doc.mozCancelFullScreen) {
      doc.mozCancelFullScreen();
    } else if (doc.msExitFullscreen) {
      doc.msExitFullscreen();
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // UI INTERACTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Handler para clic en el video - alterna play/pause */
  onVideoClick(): void {
    this.togglePlay();
  }

  /** Handler para clic en el área de controles - muestra controles */
  onControlsAreaClick(event: Event): void {
    event.stopPropagation();
    this.showControls.set(true);
    this.resetHideControlsTimer();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CONTROL VISIBILITY MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════

  /** Inicia el temporizador para ocultar controles */
  private startHideControlsTimer(): void {
    this.clearHideControlsTimer();

    this.hideControlsTimeout = setTimeout(() => {
      if (this.isPlaying()) {
        this.showControls.set(false);
      }
    }, HIDE_CONTROLS_DELAY);
  }

  /** Reinicia el temporizador para ocultar controles */
  private resetHideControlsTimer(): void {
    this.showControls.set(true);

    if (this.isPlaying()) {
      this.startHideControlsTimer();
    }
  }

  /** Limpia el temporizador de ocultar controles */
  private clearHideControlsTimer(): void {
    if (this.hideControlsTimeout) {
      clearTimeout(this.hideControlsTimeout);
      this.hideControlsTimeout = null;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // UTILITIES
  // ═══════════════════════════════════════════════════════════════════════════

  /** Formatea segundos a formato mm:ss o hh:mm:ss */
  formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const pad = (n: number) => n.toString().padStart(2, '0');

    return hours > 0
      ? `${hours}:${pad(minutes)}:${pad(secs)}`
      : `${minutes}:${pad(secs)}`;
  }

  /** Porcentaje de progreso del video */
  get progressPercentage(): number {
    return (this.currentTime() / this.duration()) * 100 || 0;
  }
}

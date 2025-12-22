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
  input,
  effect,
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
import { formatTime } from '@monorepo-bb-app/shared';

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
  playVideo = input<boolean>(false);

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
    effect(() => {
      if (this.playVideo()) {
        this.play();
      } else {
        this.pause();
      }
    });
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
    this.destroy();
  }

  public destroy(): void {
    if (this.video) {
      // 1. Pausar el video
      this.video.pause();

      // 2. Remover el src y forzar liberación de recursos
      this.video.removeAttribute('src');
      this.video.load(); // Esto aborta cualquier descarga y libera el buffer
    }

    // 3. Remover todos los event listeners
    this.removeVideoListeners();
    this.removeFullscreenListeners();

    // 4. Limpiar timers
    this.clearHideControlsTimer();

    // 5. Resetear estado
    this.isPlaying.set(false);
    this.isLoading.set(true);
    this.currentTime.set(0);
    this.duration.set(0);
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

    // Iniciar timer para ocultar controles una vez que el video está reproduciéndose
    if (this.isPlaying() && this.showControls() && !this.hideControlsTimeout) {
      this.startHideControlsTimer();
    }
  };

  private handlePlay = (): void => {
    this.isPlaying.set(true);
    this.videoPlay.emit();
    // Solo ocultar controles si el video ya tiene progreso (evita iOS auto-play glitch)
    if (this.video.currentTime > 0.1) {
      this.startHideControlsTimer();
    }
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
    this.video.muted = !shouldUnmute;
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

    // iOS Safari: eventos en el elemento <video>
    this.video.addEventListener(
      'webkitbeginfullscreen',
      this.handleIOSFullscreenChange
    );
    this.video.addEventListener(
      'webkitendfullscreen',
      this.handleIOSFullscreenChange
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

    // iOS Safari: remover eventos del elemento <video>
    this.video.removeEventListener(
      'webkitbeginfullscreen',
      this.handleIOSFullscreenChange
    );
    this.video.removeEventListener(
      'webkitendfullscreen',
      this.handleIOSFullscreenChange
    );
  }

  /** Handler para cambios de fullscreen - sincroniza el estado */
  private handleFullscreenChange = (): void => {
    const isCurrentlyFullscreen = this.isDocumentFullscreen();
    this.isFullscreen.set(isCurrentlyFullscreen);
  };

  /** Handler para cambios de fullscreen en iOS - sincroniza el estado */
  private handleIOSFullscreenChange = (event: Event): void => {
    const videoEl = this.video as any;
    // webkitDisplayingFullscreen indica si el video está en fullscreen nativo de iOS
    const isInFullscreen = videoEl.webkitDisplayingFullscreen === true;
    this.isFullscreen.set(isInFullscreen);
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
      if (!this.isFullscreen()) {
        await this.enterFullscreen();
      } else {
        await this.exitFullscreen();
      }
      this.isFullscreen.set(false);
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
    this.resetHideControlsTimer();
  }

  private async enterFullscreen(): Promise<void> {
    const videoEl = this.video as any;
    // Entrar en fullscreen
    if (this.video.requestFullscreen) {
      await this.video.requestFullscreen();
    } else if (videoEl.webkitEnterFullscreen) {
      // iOS Safari - fullscreen nativo del video
      videoEl.webkitEnterFullscreen();
    } else if (videoEl.mozRequestFullScreen) {
      await videoEl.mozRequestFullScreen();
    } else if (videoEl.msRequestFullscreen) {
      await videoEl.msRequestFullscreen();
    }
    this.isFullscreen.set(true);
  }

  private async exitFullscreen(): Promise<void> {
    const videoEl = this.video as any;
    if (videoEl.webkitDisplayingFullscreen && videoEl.webkitExitFullscreen) {
      videoEl.webkitExitFullscreen();
    } else if (this.isDocumentFullscreen()) {
      // Fullscreen API estándar
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
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // UI INTERACTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Handler para clic en el video - muestra controles o alterna play/pause */
  onVideoClick(): void {
    if (!this.showControls()) {
      // Si los controles están ocultos, mostrarlos
      this.showControls.set(true);
      this.resetHideControlsTimer();
    } else {
      // Si los controles están visibles, alternar play/pause
      this.togglePlay();
    }
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

  /** Formatea segundos a formato mm:ss o hh:mm:ss */
  timeFormat(seconds: number): string {
    return formatTime(seconds);
  }

  /** Porcentaje de progreso del video */
  get progressPercentage(): number {
    return (this.currentTime() / this.duration()) * 100 || 0;
  }
}

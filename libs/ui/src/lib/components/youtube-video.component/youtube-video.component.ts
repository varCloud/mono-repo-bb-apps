import { CONSTANTS } from '@monorepo-bb-app/shared';
import { extractYoutubeId } from '../../../../../shared/helpers/functions';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  HostListener,
  input,
  signal,
  ViewChild,
  type OnInit,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'lib-youtube-video',
  imports: [],
  templateUrl: './youtube-video.component.html',
  styleUrl: './youtube-video.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YoutubeVideoComponent implements OnInit {
  @ViewChild('videoPlayer') videoPlayer: ElementRef;

  url = signal<string>('');
  videoUrl = input.required<string>();
  destroyVideo = input<boolean>(false);
  playVideo = input<boolean>(false);

  constructor(public sanitizer: DomSanitizer) {
    effect(() => {
      const shouldDestroy = this.destroyVideo();
      console.log('Effect destroyVideo ejecutado, valor:', shouldDestroy);
      if (shouldDestroy) {
        console.log('Destruyendo video por señal (ionViewWillLeave)');
        console.log('videoPlayer existe?', !!this.videoPlayer);
        this.executeCommandOnIframe(CONSTANTS.COMMANDS_VIDEO_PLAYER.DESTROY);
      }
    });

    effect(() => {
      const action = this.playVideo()
        ? CONSTANTS.COMMANDS_VIDEO_PLAYER.PLAY
        : CONSTANTS.COMMANDS_VIDEO_PLAYER.PAUSE;
      this.executeCommandOnIframe(action);
    });
  }

  ngOnInit(): void {
    const youtubeId = extractYoutubeId(this.videoUrl() || '');
    const url = `${CONSTANTS.URL_VIDEO_PLAYER}/?yt=${youtubeId}`;
    this.url.set(this.sanitizer.bypassSecurityTrustResourceUrl(url) as string);
  }

  ngOnDestroy(): void {
    console.log('Destruyendo por ngOnDestroy (Salida de página)');
    this.executeCommandOnIframe(CONSTANTS.COMMANDS_VIDEO_PLAYER.DESTROY);
  }

  public destroy(): void {
    console.log('destroy() llamado directamente');
    this.executeCommandOnIframe(CONSTANTS.COMMANDS_VIDEO_PLAYER.DESTROY);
  }

  @HostListener('window:message', ['$event'])
  async onMessage(event: MessageEvent) {
    const comando = event.data;
    try {
      if (Capacitor.isNativePlatform()) {
        const overlay = Capacitor.getPlatform() === 'ios';
        if (comando === 'FULLSCREEN_ON') {
        }

        if (comando === 'FULLSCREEN_OFF') {
        }
      }
    } catch (e) {
      console.log('Error verificando plataforma', e);
    }
  }

  private executeCommandOnIframe(command: string) {
    if (!this.videoPlayer || !this.videoPlayer?.nativeElement) return;
    const windowIframe = this.videoPlayer.nativeElement.contentWindow;
    windowIframe?.postMessage(command, '*');
  }
}

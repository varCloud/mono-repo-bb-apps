import { CONSTANTS } from '@monorepo-bb-app/shared';
import { extractYoutubeId } from '../../../../../shared/helpers/functions';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  HostListener,
  input,
  output,
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
  pointerEventsEnabled = signal<boolean>(false);
  url = signal<string>('');
  videoUrl = input.required<string>();
  playVideo = input<boolean>(false);
  isPlaying = output<boolean>();

  constructor(public sanitizer: DomSanitizer) {
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
    if (Capacitor.isNativePlatform()) {
      this.pointerEventsEnabled.set(true);
    }
  }

  ngOnDestroy(): void {
    this.executeCommandOnIframe(CONSTANTS.COMMANDS_VIDEO_PLAYER.DESTROY);
  }

  public destroy(): void {
    this.executeCommandOnIframe(CONSTANTS.COMMANDS_VIDEO_PLAYER.DESTROY);
  }

  @HostListener('window:message', ['$event'])
  async onMessage(event: MessageEvent) {
    const command = event.data;
    try {
      if (command.state === CONSTANTS.COMMANDS_VIDEO_PLAYER.PLAYING) {
        this.isPlaying.emit(true);
      }
      if (command.state === CONSTANTS.COMMANDS_VIDEO_PLAYER.PAUSED) {
        this.isPlaying.emit(false);
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

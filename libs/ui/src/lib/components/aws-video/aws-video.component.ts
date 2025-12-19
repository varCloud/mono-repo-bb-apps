import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  ViewChild,
  type OnInit,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import * as PlyrModule from 'plyr';

@Component({
  selector: 'lib-aws-video',
  imports: [TranslatePipe],
  templateUrl: './aws-video.component.html',
  styleUrl: './aws-video.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AwsVideoComponent implements OnInit {
  @ViewChild('player') videoElement: ElementRef;

  height = input<string>('337px');
  urlVideo = input.required<string>();
  player: Plyr;

  playVideo = input<boolean>(false);

  constructor() {
    effect(() => {
      const isPlaying = this.playVideo();
      if (this.player) {
        if (isPlaying) {
          this.player.play();
        } else {
          this.player.pause();
        }
      }
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    const element = this.videoElement?.nativeElement;

    if (!element) return;

    this.player = new PlyrModule.default(element, {
      controls: [
        'play-large',
        'rewind',
        'play',
        'fast-forward',
        'progress',
        'current-time',
        'duration',
        'fullscreen',
        'settings',
      ],
    });
  }

  public destroy(): void {
    this.player?.destroy();
  }
}

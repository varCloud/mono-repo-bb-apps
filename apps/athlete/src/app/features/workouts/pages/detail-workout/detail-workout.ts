import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  signal,
  ViewChild,
  type OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import {
  IonButton,
  IonGrid,
  IonCol,
  IonRow,
  IonContent,
  IonBackButton,
  IonText,
  IonIcon,
  IonBadge,
  IonChip,
  IonLabel,
  IonItem,
} from '@ionic/angular/standalone';
import { Workout } from '@monorepo-bb-app/shared';
import { LayoutContentComponent } from '@monorepo-bb-app/ui';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  chatboxSharp,
  heart,
  heartOutline,
  timerSharp,
} from 'ionicons/icons';
import * as PlyrModule from 'plyr';

@Component({
  selector: 'app-detail-workout',
  imports: [
    IonItem,
    IonLabel,
    IonChip,
    IonIcon,
    IonText,
    IonBackButton,
    IonContent,
    IonRow,
    IonCol,
    IonGrid,
    IonButton,
    TranslateModule,
    NgClass,
  ],
  templateUrl: './detail-workout.html',
  styleUrl: './detail-workout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailWorkout implements OnInit {
  @ViewChild('player') videoElement: ElementRef<HTMLVideoElement>;
  isIos = Capacitor.getPlatform() === 'ios';
  isFavorite = signal<boolean>(false);
  workout = this.activatedRoute.snapshot.data['workout'] as Workout;
  player: Plyr;
  videoUrl = this.workout.assets[0].signedUrl || null;
  difficulty;
  level = (this.workout.difficultyLevels[0] as any).level?.description || '';
  tag = (this.workout.tags[0] as any)?.tag.name || '';

  constructor(private activatedRoute: ActivatedRoute) {
    addIcons({
      heart,
      heartOutline,
      arrowBackOutline,
      timerSharp,
      chatboxSharp,
    });
  }
  ngOnInit(): void {
    console.log(this.videoUrl, this.workout);
  }

  toggleFavorite($event: Event) {
    this.isFavorite.set(!this.isFavorite());
  }

  ngAfterViewInit() {
    this.player = new PlyrModule.default(this.videoElement.nativeElement, {
      controls: [
        'play-large', // The large play button in the center
      ],
    });
  }
}

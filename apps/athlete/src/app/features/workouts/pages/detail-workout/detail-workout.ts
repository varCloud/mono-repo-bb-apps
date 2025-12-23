import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  signal,
  ViewChild,
  type OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  IonChip,
  IonLabel,
  IonItem,
} from '@ionic/angular/standalone';
import { LocalStorageService } from '@monorepo-bb-app/core';
import {
  Asset,
  KEY_LOCALSTORAGE,
  TrainingTypeEnum,
  Workout,
  WorkoutInformationSelect,
} from '@monorepo-bb-app/shared';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  chatboxSharp,
  document,
  heart,
  heartOutline,
  play,
  timerSharp,
} from 'ionicons/icons';

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
  isFavorite = signal<boolean>(false);
  TYPE_ASSETS = TrainingTypeEnum;
  isIos = Capacitor.getPlatform() === 'ios';
  workout = this.activatedRoute.snapshot.data['workout'] as Workout;
  level = (this.workout.difficultyLevels[0] as any)?.level?.description || '';
  tag = (this.workout.tags[0] as any)?.tag.name || '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private _router: Router,
    private _localstorage: LocalStorageService,
    private _workoutInformationSelect: WorkoutInformationSelect
  ) {
    addIcons({
      heart,
      heartOutline,
      arrowBackOutline,
      timerSharp,
      chatboxSharp,
      play,
      document,
    });
  }
  ngOnInit(): void {}

  toggleFavorite($event: Event) {
    this.isFavorite.set(!this.isFavorite());
  }

  async viewDetailRutine(workoutAsset: Asset) {
    const user = await this._localstorage.get(KEY_LOCALSTORAGE.USER);
    this._workoutInformationSelect.setWorkout(this.workout);
    this._router.navigate([
      'home/workouts/workoutAsset',
      this.workout.workoutId,
      this.workout.creatorId,
      user.userId,
      workoutAsset.workoutAssetId,
    ]);
  }
}

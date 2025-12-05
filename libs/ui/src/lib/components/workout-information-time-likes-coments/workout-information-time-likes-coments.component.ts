import {
  ChangeDetectionStrategy,
  Component,
  input,
  type OnInit,
} from '@angular/core';
import { IonText, IonIcon } from '@ionic/angular/standalone';
import { Asset } from '../../../../../shared/models/workout-response-list';
import { addIcons } from 'ionicons';
import { chatboxSharp, heart, timerSharp } from 'ionicons/icons';

@Component({
  selector: 'lib-workout-information-time-likes-coments',
  imports: [IonIcon, IonText],
  templateUrl: './workout-information-time-likes-coments.component.html',
  styleUrl: './workout-information-time-likes-coments.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutInformationTimeLikesComents implements OnInit {
  workoutAsset = input.required<Asset>();

  constructor() {
    addIcons({ timerSharp, heart, chatboxSharp });
  }
  ngOnInit(): void {}
}

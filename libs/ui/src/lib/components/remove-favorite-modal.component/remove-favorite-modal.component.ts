import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Input,
  input,
  type OnInit,
} from '@angular/core';
import {
  IonContent,
  IonButton,
  IonCardSubtitle,
  IonIcon,
  IonCardContent,
  IonCardTitle,
  IonCard,
  IonImg,
  ModalController,
  IonItemDivider,
} from '@ionic/angular/standalone';
import { WorkoutListModel } from '@monorepo-bb-app/shared';
import { TranslateModule } from '@ngx-translate/core';
import { MODAL_RESPONSE } from 'libs/shared/constants/enums';

@Component({
  selector: 'lib-remove-favorite-modal',
  imports: [
    IonImg,
    IonCard,
    IonCardTitle,
    IonCardContent,
    IonIcon,
    IonCardSubtitle,
    IonButton,
    IonContent,
    TranslateModule,
    IonItemDivider,
  ],
  templateUrl: './remove-favorite-modal.component.html',
  styleUrl: './remove-favorite-modal.component.scss',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemoveFavoriteModalComponent implements OnInit {
  @Input() workout: WorkoutListModel = new WorkoutListModel({});

  get level() {
    if (!this.workout) return '';
    return this.workout.difficultyLevels
      .map((level: any) => level.description ?? '---')
      .sort()
      .join(', ');
  }
  constructor(private modalCtrl: ModalController) {}

  ngOnInit(): void {
    console.log(this.workout);
  }

  closeModal() {
    return this.modalCtrl.dismiss(null, MODAL_RESPONSE.CANCEL);
  }

  deleteFavorite() {
    return this.modalCtrl.dismiss(this.workout, MODAL_RESPONSE.CONFIRM);
  }
}

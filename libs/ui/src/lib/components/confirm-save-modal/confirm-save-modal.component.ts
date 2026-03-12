import { Component, input } from '@angular/core';
import { ModalController, IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline } from 'ionicons/icons';
import { TrainingTypeEnum } from '../../../../../shared/constants/types-routines';

@Component({
  selector: 'lib-confirm-save-modal',
  templateUrl: './confirm-save-modal.component.html',
  styleUrls: ['./confirm-save-modal.component.scss'],
  standalone: true,
  imports: [IonIcon, IonButton],
})
export class ConfirmSaveModalComponent {
  typeRoutine = input.required<TrainingTypeEnum>();

  readonly TRAINING_TYPES = TrainingTypeEnum;

  readonly labelsByType: Record<TrainingTypeEnum, string> = {
    [TrainingTypeEnum.ROUTINES]: 'el entrenamiento',
    [TrainingTypeEnum.RECORDED_CLASSES]: 'la clase',
    [TrainingTypeEnum.DOCUMENT]: 'el documento',
  };

  constructor(private modalCtrl: ModalController) {
    addIcons({ checkmarkCircleOutline });
  }

  get contentLabel(): string {
    const label =  this.labelsByType[this.typeRoutine()] ?? 'el contenido';
    return label;
  }

  closeModal() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  confirmSave() {
    this.modalCtrl.dismiss({ confirmed: true }, 'confirm');
  }
}

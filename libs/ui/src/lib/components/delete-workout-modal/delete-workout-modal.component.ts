import { Component, input } from '@angular/core';
import { ModalController, IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline, closeCircle } from 'ionicons/icons';
import { WorkoutListModel } from '@monorepo-bb-app/shared';

@Component({
  selector: 'lib-delete-workout-modal',
  templateUrl: './delete-workout-modal.component.html',
  styleUrls: ['./delete-workout-modal.component.scss'],
  standalone: true,
  imports: [IonIcon, IonButton],
})
export class DeleteWorkoutModalComponent {
  workout = input.required<WorkoutListModel>();

  constructor(private modalCtrl: ModalController) {
    addIcons({ trashOutline, closeCircle });
  }

  closeModal() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  confirmDelete() {
    this.modalCtrl.dismiss({ deleteWorkout: true }, 'confirm');
  }
}

import { Component, input, signal } from '@angular/core';
import { ModalController, IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close, closeCircleOutline } from 'ionicons/icons';

// Define la interfaz de Suscripción aquí o impórtala si la tienes
// en un archivo separado.
export interface Subscription {
  id: number;
  imageUrl: string;
  name: string;
  description: string;
  tag: string;
  tagBg: string;
  tagText: string;
}

@Component({
  selector: 'lib-options-subscriptor-modal',
  templateUrl: './options-subscriptor-modal.component.html',
  styleUrls: ['./options-subscriptor-modal.component.scss'],
  standalone: true,
  imports: [IonIcon, IonButton], // Importa solo lo que necesitas
})
export class OptionsSubscritporModalComponent {

  // Recibe la suscripción seleccionada desde la página
  subscription = input.required<Subscription>();


  viewState = signal<'options' | 'confirm'>('options');

  constructor(private modalCtrl: ModalController) {
    addIcons({ closeCircleOutline });
  }

  // --- Métodos de Control ---

  // Cierra el modal sin hacer nada
  closeModal() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  // Cambia a la vista de confirmación
  showConfirmView() {
    this.viewState.set('confirm');
  }

  // Vuelve a la vista de opciones (botón "Cancelar" en la vista 2)
  showOptionsView() {
    this.viewState.set('options');
  }

  // Confirma la cancelación y cierra el modal
  confirmCancellation() {
    // Cierra el modal y envía el 'role' = 'confirm'
    this.modalCtrl.dismiss({ confirmed: true }, 'confirm');
  }
}

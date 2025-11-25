import { Component, ChangeDetectionStrategy, computed, input, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importaciones de Ionic
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent, 
  IonButtons,
  IonButton,
  IonIcon,
  IonSearchbar,
  ModalController // Importa ModalController
} from '@ionic/angular/standalone';

// Importa los íconos
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';

// Importa nuestro acordeón y la interfaz
import {Faq } from '@monorepo-bb-app/shared';
import { AccordionComponent } from '../accordion/accordion.component';


@Component({
  selector: 'app-faq-search-modal',
  templateUrl: './faq-search-modal.component.html',
  styleUrls: ['./faq-search-modal.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    // Componentes Ionic
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonSearchbar,
    // Nuestro componente de acordeón
    AccordionComponent,
  ]
})
export class FaqSearchModalComponent {

  // 1. Recibe la lista completa de FAQs desde la página
  allFaqs = input.required<Faq[]>();

  // 2. Inyecta el ModalController para poder cerrarlo
  private modalCtrl = inject(ModalController);

  // 3. Signal para el término de búsqueda
  searchTerm = signal('');

  // 4. Signal computado para la lista filtrada
  filteredFaqs = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const faqs = this.allFaqs();

    if (!term) {
      return faqs; // Si no hay búsqueda, muestra todo
    }

    // Filtra por pregunta O respuesta
    return faqs.filter(
      (item) =>
        item.question.toLowerCase().includes(term) ||
        item.answer.toLowerCase().includes(term)
    );
  });

  constructor() {
    addIcons({ closeOutline });
  }

  // 5. Función para cerrar el modal
  dismiss() {
    this.modalCtrl.dismiss();
  }

  // 6. Función que actualiza el signal de búsqueda
  onSearchChange(event: any) {
    this.searchTerm.set(event.detail.value || '');
  }
}

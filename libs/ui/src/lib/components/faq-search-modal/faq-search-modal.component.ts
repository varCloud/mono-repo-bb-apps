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
  ModalController,
  IonItem,
  IonInput,
  IonModal
} from '@ionic/angular/standalone';

// Importa los íconos
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';

// Importa nuestro acordeón y la interfaz
import {Faq } from '@monorepo-bb-app/shared';
import { AccordionComponent } from '../accordion/accordion.component';
import { TranslateModule } from '@ngx-translate/core';




@Component({
  selector: 'app-faq-search-modal',
  templateUrl: './faq-search-modal.component.html',
  styleUrls: ['./faq-search-modal.component.scss'],
  standalone: true,
  //changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    IonSearchbar,
    IonHeader,
    IonToolbar,
    IonContent,
    AccordionComponent,
    TranslateModule,
    IonButtons,
    IonButton,
    IonIcon,
    IonItem,
    IonTitle,
    IonInput,
    IonModal
  ]
})
export class FaqSearchModalComponent {

  constructor(
    private modalCtrl: ModalController
  ) {
    addIcons({ closeOutline });
  }
 
  allFaqs = input.required<Faq[]>();
  
  searchTerm = signal('');
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


  // // 5. Función para cerrar el modal
  dismiss() {
    this.modalCtrl.dismiss();
  }

  // 6. Función que actualiza el signal de búsqueda
  onSearchChange(event: any) {
    this.searchTerm.set(event.detail.value || '');
  }

  cancel(){}

  confirm(){}
}

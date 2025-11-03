import { Component, ViewChild, ChangeDetectionStrategy, signal, computed, input, viewChild } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';


// Importaciones de Ionic Standalone
import {
  IonAccordion,
  IonAccordionGroup,
  IonButton,
  IonItem,
  IonLabel,
  AccordionGroupCustomEvent,
  IonIcon
} from '@ionic/angular/standalone';

// Importa los íconos que usaremos
import { addIcons } from 'ionicons';
import { addOutline, removeOutline, caretDownCircle,add } from 'ionicons/icons';
import { Faq } from '@monorepo-bb-app/shared';

// Definimos una interfaz para la data


@Component({
  selector: 'app-faq-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
  standalone: true,
  // 1. Añade ChangeDetectionStrategy.OnPush (mejor performance con signals)
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    JsonPipe, // <-- Añadido para el pipe | json en el debug
    IonAccordionGroup,
    IonAccordion,
    IonItem,
    IonLabel,
    IonIcon,
    IonButton,

  ],
})
export class AccordionComponent {

  // 2. @Input() se convierte en input()
  items = input.required<Faq[]>();

public tittleaccordion ?=   input<string>('Frecuent Questions');

  // 3. @ViewChild() se convierte en viewChild()
  accordionGroup = viewChild.required<IonAccordionGroup>('accordionGroup');

  // 4. Las variables de estado se convierten en signals
  // Usamos un array vacío como valor inicial seguro
  currentOpenValue = signal<string[]>([]);

  // 5. El estado derivado (allExpanded) se convierte en computed()
  // Se recalcula automáticamente cuando 'items' o 'currentOpenValue' cambian
  allExpanded = computed(() => {
    const items = this.items();
    const openItems = this.currentOpenValue();
    // Es true si la lista de items no está vacía y todos están abiertos
    return items.length > 0 && items.length === openItems.length;
  });


  constructor() {
    // Registra los íconos globalmente
    addIcons({ addOutline, removeOutline, caretDownCircle,add });
  }

  // 6. Lógica para el botón "View All" (lee y escribe signals)
  toggleAll() {
    // Lee el signal 'allExpanded'
    if (this.allExpanded()) {
      // Colapsa todos
      this.accordionGroup().value = [];
      this.currentOpenValue.set([]); // Escribe en el signal
    } else {
      // Expande todos
      const allItemValues = this.items().map( // Lee el signal 'items'
        (_, index) => 'item-' + index
      );
      this.accordionGroup().value = allItemValues;
      this.currentOpenValue.set(allItemValues); // Escribe en el signal
    }
  }

  // 7. 'onAccordionChange' ahora es más simple
  onAccordionChange(event: AccordionGroupCustomEvent) {
    // Solo actualiza el signal. 'allExpanded' se recalculará solo.
    this.currentOpenValue.set(event.detail.value as string[]);
  }

  // 8. 'isItemOpen' ahora lee el signal 'currentOpenValue'
  isItemOpen(index: number): boolean {
    const itemValue = 'item-' + index;
    // Lee el signal
    return this.currentOpenValue().includes(itemValue);
  }
}

// Interfaz para cada ítem del acordeón
import { FormsModule } from '@angular/forms'; // <-- 1. IMPORTA ESTO

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para *ngFor
import {
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonText,
  IonAccordion,
  IonAccordionGroup
} from '@ionic/angular/standalone';

// Importa los iconos que usarás
import { addIcons } from 'ionicons';
import { chevronDownOutline, chevronUpOutline } from 'ionicons/icons';

// Interfaz (puedes moverla a su propio archivo .model.ts si prefieres)
export interface FaqItem {
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-faq-accordion',
  templateUrl: './faq-accordion.component.html',
  styleUrls: ['./faq-accordion.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonText,
    IonAccordion,
    IonAccordionGroup,
    FormsModule
  ]
})
export class FaqAccordionComponent implements OnInit {

  /**
   * @Input(): El array de objetos de preguntas y respuestas.
   */
  @Input() items: FaqItem[] = [];

  /**
   * @Input(): El título principal sobre el acordeón.
   */
  @Input() headerTitle?: string = 'Top Questions';

  /**
   * @Input(): El texto para el botón de expandir todo.
   */
  @Input() viewAllText?: string = 'View all';

  // Variable para saber si "View all" está activo
  private allExpanded?: boolean = false;

  constructor() {
    // Registra los iconos que usará este componente
    addIcons({ chevronDownOutline, chevronUpOutline });
  }

  ngOnInit() {
    // Asegura que todos los items tengan su estado 'isOpen' inicializado
    this.items.forEach(item => item.isOpen = false);
  }

  /**
   * Alterna el estado de un solo ítem del acordeón.
   * @param clickedItem El ítem al que se le dio clic.
   */
  toggleItem(clickedItem: FaqItem) {
    // Cierra todos los demás (comportamiento de acordeón estándar)
    // Comenta estas líneas si quieres que se puedan abrir múltiples
    this.items.forEach(item => {
      if (item !== clickedItem) {
        item.isOpen = false;
      }
    });

    // Abre o cierra el ítem clickeado
    clickedItem.isOpen = !clickedItem.isOpen;
  }

  /**
   * Expande o colapsa TODOS los ítems al hacer clic en "View all".
   */
  toggleAll() {
    // Cambia el estado
    this.allExpanded = !this.allExpanded;

    // Aplica el estado (abierto o cerrado) a todos los ítems
    this.items.forEach(item => {
      item.isOpen = this.allExpanded;
    });

    // Actualiza el texto del botón
    this.viewAllText = this.allExpanded ? 'Collapse all' : 'View all';
  }
}

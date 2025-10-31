export interface InfoCardData {
  color: string;
  icon: string;
  title: string;
  subtitle: string;

}

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- Necesario para *ngFor

// Importa el componente que creaste antes
import { InfoCardComponent } from '../info-card/info-card.component';

// Definimos la interfaz aquí mismo para simplificar
export interface InfoCardData {
  color: string;
  icon: string;
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-card-slider',
  templateUrl: './slide-info-card.component.html',
  styleUrls: ['./slide-info-card.component.scss'],
  standalone: true,
  imports: [
    CommonModule, // <-- Añadir CommonModule
    InfoCardComponent // <-- Añadir el componente de tarjeta
  ]
})
export class CardSliderComponent {

  /**
   * @Input(): Recibe un array de objetos con la configuración
   * para cada tarjeta que se mostrará en el slider.
   */
  @Input() cards: InfoCardData[] = [];

  /**
   * @Output(): Re-emite el evento de la tarjeta hija
   * cuando una de las tarjetas es clickeada.
   */
  @Output() cardSelected = new EventEmitter<string>();

  //constructor() { }

  /**
   * Esta función se activa cuando CUALQUIERA de las info-cards
   * emite su evento (cardClicked).
   * Luego, esta función emite su PROPIO evento (cardSelected)
   * hacia el componente padre (la página).
   *
   * @param cardTitle El título de la tarjeta que fue clickeada.
   */
onCardClicked(clickedTitle: string) {
    // Compara si la tarjeta clickeada ya estaba seleccionada
    if (this.selectedCardTitle === clickedTitle) {
      // Si ya estaba seleccionada, la "apaga" (toggle)
      this.selectedCardTitle = null;
      // Emite un evento 'undefined' para que la página sepa que no hay selección
      this.cardSelected.emit(undefined);
    } else {
      // Si era una tarjeta diferente, la selecciona
      this.selectedCardTitle = clickedTitle;
      // Emite el título de la tarjeta seleccionada
      this.cardSelected.emit(clickedTitle);
    }
  }

  public selectedCardTitle: string | null = null;
}

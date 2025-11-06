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
    CommonModule,
    InfoCardComponent
  ]
})
export class CardSliderComponent {

  @Input() cards: InfoCardData[] = [];
  @Output() cardSelected = new EventEmitter<string>();

onCardClicked(clickedTitle: string) {
    if (this.selectedCardTitle === clickedTitle) {
      this.selectedCardTitle = null;
      this.cardSelected.emit(undefined);
    } else {
      this.selectedCardTitle = clickedTitle;
      this.cardSelected.emit(clickedTitle);
    }
  }
  public selectedCardTitle: string | null = null;
}

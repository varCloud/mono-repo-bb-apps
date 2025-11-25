import { InfoCardData } from '@monorepo-bb-app/shared';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoCardComponent } from '../info-card/info-card.component';
@Component({
  selector: 'app-card-slider',
  templateUrl: './slide-info-card.component.html',
  styleUrls: ['./slide-info-card.component.scss'],
  standalone: true,
  imports: [CommonModule, InfoCardComponent],
})

export class CardSliderComponent {
  @Input() cards: InfoCardData[] = [];
  @Output() cardSelected = new EventEmitter<string>();

  onCardClicked(clickedId: string) {
    if (this.selectedCardId === clickedId) {
      this.selectedCardId = null;
      this.cardSelected.emit(undefined);
    } else {
      this.selectedCardId = clickedId;
      this.cardSelected.emit(clickedId);
    }
  }
  public selectedCardId: string | null = null;
}

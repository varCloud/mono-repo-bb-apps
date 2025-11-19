import { Component, input, output } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { ellipsisHorizontal } from 'ionicons/icons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
  standalone: true,
  imports: [IonIcon, CommonModule],
})
export class UserCardComponent {

  imageUrl = input.required<string>();
  name = input.required<string>();
  descriptionPlan = input.required<string>();
  optionsClick = output<Event>();

  constructor() {
    addIcons({ ellipsisHorizontal });
  }

  onMoreOptions(event: Event) {
    event.stopPropagation();
    this.optionsClick.emit(event);
  }
}

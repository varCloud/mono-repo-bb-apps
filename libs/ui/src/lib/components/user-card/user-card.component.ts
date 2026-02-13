import { Component, input, output } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { ellipsisVertical } from 'ionicons/icons';
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
  nickName = input.required<string>();
  email = input.required<string>();
  endData = input.required<string>()
  amount = input.required<string>();
  showOptions = input<boolean>(true);

  constructor() {
    addIcons({ ellipsisVertical });
  }

  onMoreOptions(event: Event) {
    event.stopPropagation();
    this.optionsClick.emit(event);
  }
}

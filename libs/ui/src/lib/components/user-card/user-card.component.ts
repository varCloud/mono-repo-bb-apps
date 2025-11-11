import { Component, input, output } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { ellipsisHorizontal } from 'ionicons/icons';

@Component({
  selector: 'lib-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
  standalone: true,
  imports: [IonIcon],
})
export class UserCardComponent {


  imageUrl = input.required<string>();
  name = input.required<string>();
  description = input.required<string>();
  tagText = input.required<string>();

  tagColor = input<string>('#f0f0f0');
  tagTextColor = input<string>('#333333');


  optionsClick = output<Event>();

  constructor() {
    addIcons({ ellipsisHorizontal });
  }

  onMoreOptions(event: Event) {
    // Detenemos la propagación para evitar que se active
    // cualquier otro clic en la tarjeta (si lo hubiera)
    event.stopPropagation();
    // Emitimos el evento hacia el componente padre
    this.optionsClick.emit(event);
  }
}

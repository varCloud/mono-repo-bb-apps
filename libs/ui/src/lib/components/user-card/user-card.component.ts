import { Component, input, output } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { ellipsisHorizontal } from 'ionicons/icons';

@Component({
  selector: 'lib-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
  standalone: true,
  imports: [IonIcon], // Solo necesitamos IonIcon para el botón '...'
})
export class UserCardComponent {

  // --- ENTRADAS (Inputs) ---
  // Hacemos que los datos clave sean obligatorios
  imageUrl = input.required<string>();
  name = input.required<string>();
  description = input.required<string>();
  tagText = input.required<string>();

  // Inputs opcionales con valores por defecto
  tagColor = input<string>('#f0f0f0'); // color de fondo del tag
  tagTextColor = input<string>('#333333'); // color de texto del tag

  // --- SALIDAS (Outputs) ---
  // Emitirá un evento cuando se haga clic en el icono '...'
  optionsClick = output<Event>();

  constructor() {
    // Agregamos el ícono que usaremos
    addIcons({ ellipsisHorizontal });
  }

  // --- MÉTODOS ---
  onMoreOptions(event: Event) {
    // Detenemos la propagación para evitar que se active
    // cualquier otro clic en la tarjeta (si lo hubiera)
    event.stopPropagation();

    // Emitimos el evento hacia el componente padre
    this.optionsClick.emit(event);
  }
}

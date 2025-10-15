import { Component, input, output } from '@angular/core';
import {
  IonIcon,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { SelectOption } from '../../interfaces/select-option.interface';

@Component({
  selector: 'app-radio-card-selector',
  templateUrl: './radio-card-selector.component.html',
  styleUrls: ['./radio-card-selector.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    TranslateModule,
    CommonModule,
  ],
})
export class RadioCardSelectorComponent {
  // Inputs siguiendo estándares de la app
  options = input<SelectOption[]>([]);
  value = input<any>();
  disabled = input<boolean>(false);
  cardClass = input<string>('');

  // Output siguiendo estándares de la app
  valueChange = output<any>();

  // Método para seleccionar una opción al hacer click en la tarjeta
  selectOption(value: any) {
    if (!this.disabled()) {
      this.valueChange.emit(value);
    }
  }
}
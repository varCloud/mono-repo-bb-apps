import { Component, input, output } from '@angular/core';
import {
  IonRadioGroup,
  IonRadio,
  IonItem,
  IonLabel,
  IonIcon,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { SelectOption } from '../../interfaces/select-option.interface';

@Component({
  selector: 'app-radio-list-selector',
  templateUrl: './radio-list-selector.component.html',
  styleUrls: ['./radio-list-selector.component.scss'],
  standalone: true,
  imports: [
    IonRadioGroup,
    IonRadio,
    IonItem,
    IonLabel,
    IonIcon,
    TranslateModule,
    CommonModule,
  ],
})
export class RadioListSelectorComponent {
  // Inputs siguiendo estándares de la app
  options = input<SelectOption[]>([]);
  value = input<any>();
  disabled = input<boolean>(false);
  itemClass = input<string>('');

  // Output siguiendo estándares de la app
  valueChange = output<any>();

  onSelectionChange(event: any) {
    this.valueChange.emit(event.detail.value);
  }
}
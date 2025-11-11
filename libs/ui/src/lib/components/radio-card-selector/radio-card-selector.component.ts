import { Component, effect, input, output } from '@angular/core';
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
  options = input<SelectOption[]>([]);
  value = input<any>();
  disabled = input<boolean>(false);
  cardClass = input<string>('');
  public selectedValue = -1
  valueChange = output<any>();

  constructor() {
    effect(() => {
      this.selectedValue = this.value();
    })
  }
  selectOption(value: any) {
    
    if (!this.disabled()) {
      this.selectedValue = value;
      this.valueChange.emit(value);
    }
  }
}
import { Component, input, output } from '@angular/core';
import {
  IonCheckbox,
  IonItem,
  IonLabel,
  IonIcon,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { SelectOption } from '../../interfaces/select-option.interface';

@Component({
  selector: 'app-checkbox-list-selector',
  templateUrl: './checkbox-list-selector.component.html',
  styleUrls: ['./checkbox-list-selector.component.scss'],
  standalone: true,
  imports: [
    IonCheckbox,
    IonItem,
    IonLabel,
    IonIcon,
    TranslateModule,
    CommonModule,
  ],
})
export class CheckboxListSelectorComponent {
  // Inputs siguiendo estándares de la app
  options = input<SelectOption[]>([]);
  selectedValues = input<any[]>([]);
  disabled = input<boolean>(false);
  itemClass = input<string>('');
  maxSelections = input<number>();

  // Output siguiendo estándares de la app
  selectedValuesChange = output<any[]>();

  isSelected(value: any): boolean {
    return this.selectedValues().includes(value);
  }

  onOptionChange(value: any, event: any) {
    const currentValues = [...this.selectedValues()];
    
    if (event.detail.checked) {
      // Check max selections limit
      const maxLimit = this.maxSelections();
      if (maxLimit && currentValues.length >= maxLimit) {
        return;
      }
      currentValues.push(value);
    } else {
      const index = currentValues.indexOf(value);
      if (index > -1) {
        currentValues.splice(index, 1);
      }
    }
    
    this.selectedValuesChange.emit(currentValues);
  }
}
import { Component, input, output, model } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonSearchbar,
  IonText
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-simple-search-input',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonSearchbar,
    IonText
  ]
})

export class SimpleSearchInputComponent {

  searchValue = model<string>('');
  placeholder = input<string>('Search');
  headerTitle = input<string>('¿Cómo podemos ayudarte?');
  debounce = input<number>(300);

  searchSubmitted = output<string>();
  searchCleared = output<void>();

  constructor() {}

  onSearchInput(event: any) {
    this.searchValue.set(event.detail.value || '');
  }

  onSearchSubmit(event: any) {
    this.searchSubmitted.emit(event.detail.value || '');
  }

  onSearchClear() {
    this.searchValue.set('');
    this.searchCleared.emit();
  }
}

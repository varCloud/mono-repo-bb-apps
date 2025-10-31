import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para ngModel
import {
  IonSearchbar,
  IonText // Para el título si no usas Header/Toolbar
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-simple-search-input', // Tu selector HTML
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, // IMPORTER ESTO ES CRUCIAL PARA [(ngModel)]
    IonSearchbar,
    IonText
  ]
})
export class SimpleSearchInputComponent implements OnInit {

  /**
   * @Input(): Recibe el valor inicial del string de búsqueda desde el componente padre.
   * Por ejemplo: <app-simple-search-input [searchValue]="'palabra inicial'"></app-simple-search-input>
   */
  @Input() searchValue ?: string  = '';

  /**
   * @Input(): Texto del placeholder del campo de búsqueda.
   * Por defecto: 'Search'
   */
  @Input() placeholder ?: string = 'Search';

  /**
   * @Input(): Título opcional que se muestra encima del campo de búsqueda.
   * Por defecto: '¿Cómo podemos ayudarte?'
   */
  @Input() headerTitle?: string = '¿Cómo podemos ayudarte?';

  /**
   * @Input(): Retraso en milisegundos para emitir el evento searchChanged.
   * Útil para no disparar búsquedas en cada tecla.
   * Por defecto: 300ms
   */
  @Input() debounce?: number = 300;

  /**
   * @Output(): Emite el nuevo valor del string de búsqueda cada vez que cambia.
   * Por ejemplo: (searchValueChange)="onSearchTextChange($event)"
   */
  @Output() searchValueChange = new EventEmitter<string>();

  /**
   * @Output(): Emite cuando el usuario presiona Enter en el campo de búsqueda.
   */
  @Output() searchSubmitted = new EventEmitter<string>();

  /**
   * @Output(): Emite cuando el campo de búsqueda se limpia.
   */
  @Output() searchCleared = new EventEmitter<void>();


  // Una variable interna para manejar el valor del searchbar
  // Se inicializa con el valor del input, si existe.
  currentInputValue?: string = '';

  ngOnInit() {
    // Aseguramos que el valor interno se inicialice con el valor del input
    this.currentInputValue = this.searchValue;
  }

  /**
   * Maneja el evento 'ionInput' (cada vez que el usuario escribe, con debounce).
   * Emite el valor actualizado a través de 'searchValueChange'.
   */
  onSearchInput(event: any) {
    this.currentInputValue = event.detail.value || ''; // Asegurarse de que no sea null
    this.searchValueChange.emit(this.currentInputValue);
  }

  /**
   * Maneja el evento 'ionSearch' (cuando el usuario presiona Enter).
   * Emite el valor actual a través de 'searchSubmitted'.
   */
  onSearchSubmit(event: any) {
    this.searchSubmitted.emit(event.detail.value || '');
  }

  /**
   * Maneja el evento 'ionClear' (cuando el usuario hace clic en el botón de limpiar).
   * Emite un evento de limpieza y también un cambio de valor vacío.
   */
  onSearchClear() {
    this.currentInputValue = '';
    this.searchCleared.emit();
    this.searchValueChange.emit(''); // Notificar que el valor ha sido limpiado
  }
}

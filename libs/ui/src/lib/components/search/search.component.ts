import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
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
export class SimpleSearchInputComponent implements OnInit {
  @Input() searchValue ?: string  = '';
  @Input() placeholder ?: string = 'Search';
  @Input() headerTitle?: string = '¿Cómo podemos ayudarte?';
  @Input() debounce?: number = 300;
  @Output() searchValueChange = new EventEmitter<string>();
  @Output() searchSubmitted = new EventEmitter<string>();
  @Output() searchCleared = new EventEmitter<void>();
  currentInputValue?: string = '';

  ngOnInit() {
    this.currentInputValue = this.searchValue;
  }

  onSearchInput(event: any) {
    this.currentInputValue = event.detail.value || '';
    this.searchValueChange.emit(this.currentInputValue);
  }

  onSearchSubmit(event: any) {
    this.searchSubmitted.emit(event.detail.value || '');
  }

  onSearchClear() {
    this.currentInputValue = '';
    this.searchCleared.emit();
    this.searchValueChange.emit('');
  }
}

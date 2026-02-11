import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-modal-header-searchbar',
  templateUrl: './modal-header-searchbar.component.html',
  styleUrls: ['./modal-header-searchbar.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, TranslateModule],
})
export class ModalHeaderSearchbarComponent {
  // Signals para las propiedades de entrada
  title = signal<string>('');
  placeholder = signal<string>('');

  // Inputs para compatibilidad (se mantienen para casos donde no se use signals)
  @Input() set titleText(value: string) {
    this.title.set(value);
  }

  @Input() set placeholderText(value: string) {
    this.placeholder.set(value);
  }

  // Outputs para los eventos
  @Output() dismiss = new EventEmitter<void>();
  @Output() search = new EventEmitter<CustomEvent>();

  constructor() {
    addIcons({ chevronBackOutline });
  }

  onDismiss(): void {
    this.dismiss.emit();
  }

  onSearch(event: CustomEvent): void {
    this.search.emit(event);
  }

  // Métodos públicos para actualizar signals desde el componente padre
  setTitle(title: string): void {
    this.title.set(title);
  }

  setPlaceholder(placeholder: string): void {
    this.placeholder.set(placeholder);
  }
}
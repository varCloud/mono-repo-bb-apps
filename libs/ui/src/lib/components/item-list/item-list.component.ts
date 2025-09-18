import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class ItemListComponent {
  @Input() text: string = '';
  @Input() showArrow: boolean = true;
  @Input() icon?: string;
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() actionText?: string;
  @Input() labelClass?: string = '';
  @Input() iconEnd?: string;

  @Output() itemClick = new EventEmitter<void>();

  onClick(): void {
    if (!this.disabled && !this.loading) {
      this.itemClick.emit();
    }
  }
}

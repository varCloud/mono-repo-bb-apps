import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { searchOutline } from 'ionicons/icons';

@Component({
  selector: 'app-header-search',
  templateUrl: './header-search.component.html',
  styleUrls: ['./header-search.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class HeaderSearchComponent {
  @Input() logoUrl: string = './assets/images/logo-con-letras.svg';
  @Input() title: string = '';
  @Output() clickSearch = new EventEmitter<void>();

  constructor() {
    addIcons({ searchOutline });
  }

  searchClick(): void {
    this.clickSearch.emit();
  }
}

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonCard,
  IonCardContent,
  IonIcon,
  IonText,
  IonRippleEffect
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { informationCircle,
  informationCircleOutline,
  restaurantOutline,
  chatbubblesOutline,
  calendarOutline,
  notificationsOutline,
  cubeOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-info-card', // Tu selector HTML
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonCard,
    IonCardContent,
    IonIcon,
    IonText,
    IonRippleEffect
  ]
})
export class InfoCardComponent {
  constructor() {
    addIcons({
      informationCircle,
      informationCircleOutline,
      calendarOutline,
      chatbubblesOutline,
      restaurantOutline,
      notificationsOutline,
      cubeOutline

    });
  }

  @Input() color?: string = 'tertiary';
  @Input() icon?: string = 'information-circle-outline';
  @Input() title?: string = 'Título no definido';
  @Input() subtitle?: string = 'Subtítulo no definido';
  @Output() cardClicked = new EventEmitter<string>();

  onCardClick() {
    this.cardClicked.emit(this.title);
  }

  @Input() isSelected?: boolean = false;

  isIonicColor(colorName: string): boolean {
    const ionicColors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger', 'light', 'medium', 'dark'];
    return ionicColors.includes(colorName);
  }

  getIconColor(): string {
    return this.isIonicColor(this.color) ? 'light' : 'dark';
  }
}

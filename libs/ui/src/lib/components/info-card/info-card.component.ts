import { Component, computed, input, output } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import {
  IonCard,
  IonCardContent,
  IonIcon,
  IonText,
  IonRippleEffect
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  informationCircle,
  informationCircleOutline,
  restaurantOutline,
  chatbubblesOutline,
  calendarOutline,
  notificationsOutline,
  cubeOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-info-card',
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

  color = input<string>('tertiary');
  icon = input<string>('information-circle-outline');
  title = input<string>('Título no definido');
  subtitle = input<string>('Subtítulo no definido');
  isSelected = input<boolean>(false);
  cardClicked = output<string>();

  onCardClick() {
    this.cardClicked.emit(this.title());
  }

  iconColor = computed(() => {
    return this.isIonicColor(this.color()) ? 'light' : 'dark';
  });

  public isIonicColor(colorName: string): boolean {
    const ionicColors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger', 'light', 'medium', 'dark'];
    return ionicColors.includes(colorName);
  }
}

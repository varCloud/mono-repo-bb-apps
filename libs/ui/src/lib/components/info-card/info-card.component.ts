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



  /**
   * @Input(): Color de fondo de la tarjeta.
   * Por defecto: 'tertiary' (usa una variable CSS de Ionic).
   * También puedes pasar un CSS hex/rgb, ej: '#E0F7FA'.
   */
  @Input() color?: string = 'tertiary';


  /**
   * @Input(): Nombre del icono de Ionicons a mostrar.
   * Por defecto: 'information-circle-outline'.
   */
  @Input() icon?: string = 'information-circle-outline';

  /**
   * @Input(): Título principal de la tarjeta.
   * Por defecto: 'Título no definido'.
   */
  @Input() title?: string = 'Título no definido';

  /**
   * @Input(): Subtítulo o descripción corta.
   * Por defecto: 'Subtítulo no definido'.
   */
  @Input() subtitle?: string = 'Subtítulo no definido';

  /**
   * @Output(): Emite un evento cuando la tarjeta es clickeada/tocada.
   * Puedes pasar datos con el evento, ej: el título de la tarjeta.
   */
  @Output() cardClicked = new EventEmitter<string>();


  /**
   * Método que se ejecuta cuando el usuario hace click en la tarjeta.
   * Emite el evento 'cardClicked' con el título de la tarjeta.
   */
  onCardClick() {
    this.cardClicked.emit(this.title);
  }
  // ... (parte superior del archivo)


  @Input() isSelected?: boolean = false;



  // Método auxiliar para determinar si el color es una variable de Ionic
  isIonicColor(colorName: string): boolean {
    // Comprueba si el nombre del color es uno de los colores predefinidos de Ionic
    const ionicColors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger', 'light', 'medium', 'dark'];
    return ionicColors.includes(colorName);
  }

  // Define el color del icono (generalmente 'light' o 'dark' dependiendo del fondo)
  getIconColor(): string {
    // Puedes mejorar esta lógica si necesitas más control sobre el contraste
    return this.isIonicColor(this.color) ? 'light' : 'dark';
  }
}

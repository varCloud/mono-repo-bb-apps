import { Component } from '@angular/core';
// ... otras importaciones
import { CardSliderComponent, InfoCardData } from '../slide-info-card/slide-info-card.component'; // <-- 1. Importa
import {

IonContent
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { informationCircle, informationCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home-slide-card.component.html',
  styleUrls: ['home-slide-card.component.scss'],
  standalone: true,
  imports: [
    // ... otras importaciones
    CardSliderComponent, // <-- 2. Añade a imports


    IonContent
  ],
})
export class HomeSlideCard {

  constructor() {
    addIcons({
      informationCircle,
      informationCircleOutline,

    });
  }

  // 3. Define el array de datos para tu slider
  cardCategories: InfoCardData[] = [
    {
      title: 'Entrenamientos',
      subtitle: 'Preguntas sobre',
      icon: 'notifications-outline',
      color: 'tertiary'
    },
    {
      title: 'Suscripciones',
      subtitle: 'Preguntas sobre',
      icon: 'cube-outline',
      color: 'success'
    },
    {
      title: 'Horario',
      subtitle: 'Consulta tu',
      icon: 'calendar-outline',
      color: '#FFC107' // Color personalizado
    },
    {
      title: 'Soporte',
      subtitle: 'Contacta a',
      icon: 'chatbubbles-outline',
      color: '#03A9F4' // Color personalizado
    },
    // ¡Puedes agregar tantas tarjetas como quieras!
    {
      title: 'Nutrición',
      subtitle: 'Planes de',
      icon: 'restaurant-outline',
      color: 'danger'
    }
  ];

  //constructor() {}

  /**
   * Método que se ejecuta cuando una tarjeta es clickeada
   * (el evento viene ahora desde 'app-card-slider').
   */
  onSliderCardClicked(cardTitle: string) {
    console.log('La página principal recibió el clic de:', cardTitle);
    alert(`Has clickeado la tarjeta de: ${cardTitle}`);
  }
}

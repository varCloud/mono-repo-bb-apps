import { Component } from '@angular/core';
// ... otras importaciones
import { FaqAccordionComponent, FaqItem } from '../faq-accordion/faq-accordion.component'; // <-- 1. Importa
import {
  IonHeader,    // <-- 1. Importa el componente
  IonToolbar,
  IonTitle,
  IonContent
} from '@ionic/angular/standalone';


@Component({
  selector: 'app-home',
  templateUrl: 'home-faq-accordion.component.html',
  styleUrls: ['home-faq-accordion.component.scss'],
  standalone: true,
  imports: [
    // ... otras importaciones
  FaqAccordionComponent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent
  ],
})
export class HomePageAccordion {

  // 3. Define tu array de preguntas y respuestas
  myFaqItems: FaqItem[] = [
    {
      question: '¿Qué es Ionic?',
      answer: 'Ionic es un SDK de código abierto para el desarrollo de aplicaciones híbridas...',
      isOpen: false
    },
    {
      question: '¿Qué es Angular?',
      answer: 'Angular es un framework para aplicaciones web desarrollado en TypeScript...',
      isOpen: false
    },
    {
      question: '¿Cómo funciona un componente Standalone?',
      answer: 'Los componentes Standalone (independientes) simplifican la autoría...',
      isOpen: false
    }
  ];


}

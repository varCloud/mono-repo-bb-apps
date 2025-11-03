import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { Faq } from '@monorepo-bb-app/shared';
import { AccordionComponent } from '@monorepo-bb-app/ui';

@Component({
  selector: 'app-home-accordion',
  templateUrl: 'home-dynamic-accordion.component.html',
  styleUrls: ['home-dynamic-accordion.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    AccordionComponent,
  ],
})
export class HomeAccordion {
  myFaqList: Faq[] = [
    {
      question: '¿Cómo crear una cuenta?',
      answer:
        'Para crear la cuenta, navega a la sección de registro, ingresa tu correo electrónico y contraseña segura, y luego sigue los pasos para verificar de identidad.',
    },
    {
      question: '¿Cómo restablecer mi contraseña?',
      answer:
        'Ve a la pantalla de inicio de sesión y presiona "Olvidé mi contraseña". Recibirás un correo con instrucciones.',
    },
    {
      question: '¿Cómo contacto a soporte técnico?',
      answer:
        'Puedes contactarnos a través del chat en vivo en la app, o enviando un correo a support@ejemplo.com.',
    },
    {
      question: '¿Qué métodos de pago se aceptan?',
      answer: 'Aceptamos tarjetas de crédito (Visa, Mastercard) y PayPal.',
    },
  ];

  constructor() {}
}


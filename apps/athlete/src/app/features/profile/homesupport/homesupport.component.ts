import { Component, input } from '@angular/core';
// ... otras importaciones
import { CardSliderComponent, InfoCardData } from '@monorepo-bb-app/ui'; // <-- 1. Importa // <-- 1. Importa
import {
  IonSearchbar,
  IonContent,
  IonText,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonList,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  informationCircle,
  informationCircleOutline,
  callOutline,
  mailOutline,
  listOutline,
  mail,
  call,
  personCircleOutline,
  businessOutline,
  helpCircleOutline,
  arrowBackOutline,
} from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para ngModel
import {
  AccordionComponent,
  SimpleSearchInputComponent,
  ToolBarComponent,
} from '@monorepo-bb-app/ui';
import { Faq } from '@monorepo-bb-app/shared';
import { FaqService } from '@monorepo-bb-app/core';

@Component({
  selector: 'app-home-support',
  templateUrl: 'homesupport.component.html',
  styleUrls: ['homesupport.component.scss'],
  standalone: true,
  imports: [
    ToolBarComponent,
    FormsModule, // IMPORTER ESTO ES CRUCIAL PARA [(ngModel)]
    CommonModule,
    // ... otras importaciones
    CardSliderComponent, // <-- 2. Añade a imports
    SimpleSearchInputComponent,
    IonSearchbar,
    IonText,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel,
    IonList,
    AccordionComponent,
  ],
})
export class homesupport {
  constructor(private faqService: FaqService) {
    addIcons({
      informationCircle,
      informationCircleOutline,
      callOutline,
      mailOutline,
      listOutline,
      mail,
      call,
      personCircleOutline,
      businessOutline,
      helpCircleOutline,
      arrowBackOutline,
    });
    this.getFacts();
  }

  public getFacts() {
    this.faqService.getFact(1, 1).subscribe((varResponse: any) => {
      console.log('Respuesta de FAQs:', varResponse);
    });
  }

  // toolbar
  public leftIcon = input<string>('arrow-back-outline');
  public backLink = input<string>('https://google.com');
  public title = input<string>('Help');
  public emailLink = input<string>('gusmg90@gmail.com');
  public emailIcon = input<string>('mail-outline');
  public phoneIcon = input<string>('call-outline');
  public phoneLink = input<string>('+524432426259');


  //info slider
  cardCategories: InfoCardData[] = [
    {
      title: 'Entrenamientos',
      subtitle: 'Preguntas sobre',
      icon: 'notifications-outline',
      color: '#E3F8FF',
    },
    {
      title: 'Suscripciones',
      subtitle: 'Preguntas sobre',
      icon: 'cube-outline',
      color: '#E8FFEB',
    },
    {
      title: 'Horario',
      subtitle: 'Consulta tu',
      icon: 'calendar-outline',
      color: '#FFF0E8',
    },
    {
      title: 'Soporte',
      subtitle: 'Contacta a',
      icon: 'chatbubbles-outline',
      color: '#03A9F4',
    },
    {
      title: 'Nutrición',
      subtitle: 'Planes de',
      icon: 'restaurant-outline',
      color: 'danger',
    },
  ];

  onSliderCardClicked(cardTitle: string) {
    // acciones al hacer clic en una tarjeta
  }

  //search input
  mySearchText?: string = '';

  onSearchTextChange(newText: string) {
    this.mySearchText = newText;
    console.log('Texto de búsqueda actualizado:', this.mySearchText);
  }

  onSearchSubmit(submittedText: string) {
    console.log('Búsqueda enviada por Enter:', submittedText);
  }

  onSearchClearEvent() {
    console.log('Campo de búsqueda limpiado.');
    this.mySearchText = '';
  }
  //accordion

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
}

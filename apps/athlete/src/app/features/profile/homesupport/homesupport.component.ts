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
IonItem, IonLabel, IonList
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { informationCircle, informationCircleOutline, callOutline, mailOutline, listOutline, mail, call, personCircleOutline, businessOutline, helpCircleOutline,
arrowBackOutline } from 'ionicons/icons';
import { Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para ngModel
import { AccordionComponent, SimpleSearchInputComponent, ToolBarComponent } from '@monorepo-bb-app/ui';
import { Faq } from '@monorepo-bb-app/shared';


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

  constructor() {
    addIcons({
      informationCircle,
      informationCircleOutline,
      callOutline,
      mailOutline,
      listOutline,
      mail,
      call, personCircleOutline,
      businessOutline,
      helpCircleOutline,
      arrowBackOutline
    });
  }

//------------------------------------------------------------- inicio contact item -------------------------------------------------

/** Icono y enlace de back*/
  //@Input() leftIcon?: string = 'arrow-back-outline'; // Un icono por defecto
  //@Input() backLink?: string = 'algo de enlace';
  public leftIcon = input<string>('arrow-back-outline');
  public backLink = input<string>('https://google.com');

  /** El texto del título principal   */
  //@Input() title?: string = 'Soporte';
  public title = input<string>('Help');

  /**Icono y correo */
  //@Input() emailIcon?: string = 'mail-outline';
  //@Input() emailLink?: string ='gusmg90@gmail.com'; // El '?' lo hace opcional
  public emailLink = input<string>('gusmg90@gmail.com');
  public emailIcon = input<string>('mail-outline');

  /**Icono y numero para el teléfono*/
  //@Input() phoneIcon?: string = 'call-outline';
  //@Input() phoneLink?: string = '+524432426259';
  public phoneIcon = input<string>('call-outline');
  public phoneLink = input<string>('+524432426259');

//------------------------------------------------------------- fin contact item -------------------------------------------------
//------------------------------------------------------------- inicio slider -------------------------------------------------
  // 3. Define el array de datos para tu slider
  cardCategories: InfoCardData[] = [
    {
      title: 'Entrenamientos',
      subtitle: 'Preguntas sobre',
      icon: 'notifications-outline',
      color: '#E3F8FF' // Color personalizado
    },
    {
      title: 'Suscripciones',
      subtitle: 'Preguntas sobre',
      icon: 'cube-outline',
      color: '#E8FFEB' // Color personalizado
    },
    {
      title: 'Horario',
      subtitle: 'Consulta tu',
      icon: 'calendar-outline',
      color: '#FFF0E8' // Color personalizado
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
      color: 'danger',

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

//-------------------------------------------------------------fin slider / inicio search -------------------------------------------------

mySearchText?: string = ''; // Puedes darle un valor inicial



  /**
   * Se ejecuta cada vez que el texto en el campo de búsqueda cambia (con debounce).
   */
  onSearchTextChange(newText: string) {
    this.mySearchText = newText;
    console.log('Texto de búsqueda actualizado:', this.mySearchText);
    // Aquí puedes llamar a una función para filtrar resultados, etc.
  }

  /**
   * Se ejecuta cuando el usuario presiona "Enter".
   */
  onSearchSubmit(submittedText: string) {
    console.log('Búsqueda enviada por Enter:', submittedText);
    // Realiza la acción final de búsqueda
  }

  /**
   * Se ejecuta cuando el usuario limpia el campo de búsqueda.
   */
  onSearchClearEvent() {
    console.log('Campo de búsqueda limpiado.');
    // Resetea tus resultados o lo que sea necesario
    this.mySearchText = '';
  }
//-------------------------------------------------------------fin search -------------------------------------------------
// ------------------------------------------------------------- inicio  accordion -------------------------------------------------


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
//------------------------------------------------------------- fin accordion -------------------------------------------------

}

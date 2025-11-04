import { Component, input, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
// Importamos los módulos de Ionic que usaremos en el template
import {IonButton, IonItem, IonLabel, IonButtons, IonIcon} from '@ionic/angular/standalone';
import {callOutline, mailOutline, listOutline, mail, call, personCircleOutline, businessOutline, helpCircleOutline,
arrowBackOutline} from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  standalone: true,
  imports: [
    CommonModule, // Necesario para *ngIf
    IonItem,
    IonIcon,
    IonLabel,
    IonButtons,
    IonButton,
    RouterLink

  ]
})
export class ToolBarComponent {

  constructor(
    private _router: Router
  ) {
    addIcons({
      callOutline,
      mailOutline,
      listOutline,
      mail,
      call,
      personCircleOutline,
      businessOutline,
      helpCircleOutline,
      arrowBackOutline
    });

  }

  /** Icono y enlace de back*/
  //@Input() leftIcon?: string = 'arrow-back-outline'; // Un icono por defecto
  //@Input() backLink?: string = 'algo de enlace';
  public leftIcon = input<string>('arrow-back-outline');
  public backLink = input<string>('/home');

  /** El texto del título principal   */
  //@Input() title?: string = 'Soporte';
  public title = input<string>('ingresa un titlo');

  /**Icono y correo */
  //@Input() emailIcon?: string = 'mail-outline';
  //@Input() emailLink?: string ='gusmg90@gmail.com'; // El '?' lo hace opcional
  public emailLink = input<string>('');
  public emailIcon = input<string>('mail-outline');

  /**Icono y numero para el teléfono*/
  //@Input() phoneIcon?: string = 'call-outline';
  //@Input() phoneLink?: string = '+524432426259';
  public phoneIcon = input<string>('call-outline');
  public phoneLink = input<string>('');

  onBackClick() {
     this._router.navigateByUrl('/home');
}
}

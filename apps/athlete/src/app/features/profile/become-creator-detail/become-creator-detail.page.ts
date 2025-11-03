import { IonContent } from '@ionic/angular';
import {ToolBarComponent} from '../support/toolbar/toolbar.component';
import { input,Component, ViewChild } from '@angular/core';
import { IonFab, IonFabButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-become-creator-detail',
  templateUrl: 'become-creator-detail.page.html',
  styleUrls: ['become-creator-detail.page.scss'],
  standalone: true,
  imports: [
    ToolBarComponent,
    IonFab, IonFabButton
  ],
})

export class BecomeCreatorDetailComponent {

@ViewChild(IonContent, { static: false }) content: IonContent | undefined;


  scrollToTop() {
    this.content?.scrollToTop(500); // Scrolls to the top with a 500ms animation
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
  public emailLink = input<string>('');
  public emailIcon = input<string>('mail-outline');

  /**Icono y numero para el teléfono*/
  //@Input() phoneIcon?: string = 'call-outline';
  //@Input() phoneLink?: string = '+524432426259';
  public phoneIcon = input<string>('call-outline');
  public phoneLink = input<string>('');

//------------------------------------------------------------- fin contact item -------------------------------------------------


}

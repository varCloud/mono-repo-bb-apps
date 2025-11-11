import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonButton, IonItem, IonButtons, IonIcon,IonLabel, IonHeader, IonToolbar } from '@ionic/angular/standalone';
import {
  callOutline, mailOutline, listOutline, mail, call, personCircleOutline, businessOutline, helpCircleOutline,
  arrowBackOutline
} from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Router} from '@angular/router';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonItem,
    IonIcon,
    IonLabel,
    IonButtons,
    IonButton,
    IonHeader,
    IonToolbar
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

  public leftIcon = input<string>('arrow-back-outline');
  public backLink = input<string>('/home/profile');

  public title = input<string>('ingresa un titlo');
  public emailLink = input<string>('algo');
  public emailIcon = input<string>('mail-outline');

  public phoneIcon = input<string>('call-outline');
  public phoneLink = input<string>('algo');

  onBackClick() {
    this._router.navigate(['/home/profile'], { replaceUrl: true }).catch(err => {
      console.error('Navigation error:', err);
    });
  }
}

import { Component, type OnInit } from '@angular/core';
import { SesionService } from '@monorepo-bb-app/core';
import { LayoutContentComponent, OnbordingComponent } from '@monorepo-bb-app/ui';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  NavController,
} from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-stripe-onbording',
  imports: [
    IonGrid,
    IonContent,
    IonTitle,
    IonToolbar,
    IonHeader,
    OnbordingComponent,
    LayoutContentComponent,
  ],
  templateUrl: './stripe-onbording.component.html',
  styleUrl: './stripe-onbording.component.scss',
})
export class StripeOnbordingComponent implements OnInit {
  constructor(
    public sesion: SesionService,
    private _router: NavController,
    private alertController: AlertController
  ) {}
  ngOnInit(): void {}

  skipOnbording() {
    this._router.navigateRoot(['/home'], { replaceUrl: true });
  }

  isSuccesOnbording(sucess: boolean) {
    if (sucess) {
      this.alertMessage(true);
      this._router.navigateRoot(['/home'], { replaceUrl: true });
    } else {
      this.alertMessage(false);
    }
  }

  async alertMessage(isSuccess: boolean) {
    const headerMsg = isSuccess
      ? 'Felicidades has completado tu registro en Stripe!'
      : 'Hubo un problema con tu registro en Stripe.';
    const messageMsg = isSuccess
      ? 'Tu cuenta ha sido verificada exitosamente.'
      : 'Por favor, pero no te preocupes intenta completar el proceso nuevamente.';
    const alert = await this.alertController.create({
      header: headerMsg,
      message: messageMsg,
      buttons: ['Aceptar'],
    });

    await alert.present();
  }
}

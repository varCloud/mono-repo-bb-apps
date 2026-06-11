import { Component, type OnInit } from '@angular/core';
import { SesionService } from '@monorepo-bb-app/core';
import {
  LayoutContentComponent,
  OnbordingComponent,
  StripeOnboardingResultModalComponent,
} from '@monorepo-bb-app/ui';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  NavController,
  ModalController,
} from '@ionic/angular/standalone';

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
    private _modalCtrl: ModalController
  ) {}
  ngOnInit(): void {}

  skipOnbording() {
    this._router.navigateRoot(['/home'], { replaceUrl: true });
  }

  isSuccesOnbording(sucess: boolean) {
    this.showResultModal(sucess);
  }

  private async showResultModal(isSuccess: boolean): Promise<void> {
    const modal = await this._modalCtrl.create({
      component: StripeOnboardingResultModalComponent,
      componentProps: { isSuccess },
      breakpoints: [0.5, 1],
      initialBreakpoint: 0.5,
      handle: false,
      cssClass: 'bottom-sheet-modal-rounded',
    });

    await modal.present();
    await modal.onDidDismiss();

    if (isSuccess) {
      this._router.navigateRoot(['/home'], { replaceUrl: true });
    }
  }
}

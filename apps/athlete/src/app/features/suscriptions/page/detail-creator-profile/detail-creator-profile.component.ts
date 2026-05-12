import {
  ChangeDetectionStrategy,
  Component,
  signal,
  type OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular/standalone';
import { Browser } from '@capacitor/browser';
import { DetailCreatorProfileComponent } from '@monorepo-bb-app/ui';
import { LeaveAppModalComponent } from './leave-app-modal/leave-app-modal.component';
import { environment } from '@monorepo-bb-app/shared';

const PLANS_BASE_URL = environment.URL_ATHLETE_WEB + '/login'; 

@Component({
  selector: 'app-detail-creator-profile',
  imports: [DetailCreatorProfileComponent],
  templateUrl: './detail-creator-profile.component.html',
  styleUrl: './detail-creator-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailCreatorProfilePageComponent implements OnInit {
  public idCreator = signal<number | null>(null);

  constructor(
    private _routerActivate: ActivatedRoute,
    private _modalCtrl: ModalController,
  ) {}

  ngOnInit(): void {
    const id = this._routerActivate.snapshot.paramMap.get('id');
    this.idCreator.set(id ? +id : null);
  }

  async goToSuscriptionCreator() {
    const creatorId = this.idCreator();
    const url = `${PLANS_BASE_URL}?creatorId=${creatorId}`;

    const modal = await this._modalCtrl.create({
      component: LeaveAppModalComponent,
      componentProps: { url },
      breakpoints: [0, 0.75, 1],
      initialBreakpoint: 0.75,
      handle: false,
      cssClass: 'bottom-sheet-modal-rounded',
    });

    await modal.present();

    const { data, role } = await modal.onDidDismiss();

    if (role === 'confirm' && data?.confirmed) {
      await Browser.open({ url: data.url });
    }
  }
}

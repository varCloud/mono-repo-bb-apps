import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
  type OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular/standalone';
import { Browser } from '@capacitor/browser';
import { DetailCreatorProfileComponent } from '@monorepo-bb-app/ui';
import { AppSettingsService, AthleteDeepLinkService } from '@monorepo-bb-app/core';
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
  public workoutId = signal<number | null>(null);
  public athleteId = signal<number | null>(null);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _deepLinkService = inject(AthleteDeepLinkService);
  private readonly _appSettingsService = inject(AppSettingsService);

  constructor(
    private _routerActivate: ActivatedRoute,
    private _modalCtrl: ModalController,
    private _router: Router,
  ) {}

  ngOnInit(): void {
    const id = this._routerActivate.snapshot.paramMap.get('id');
    const workoutId = this._routerActivate.snapshot.queryParamMap.get('workoutId');
    const athleteId = this._routerActivate.snapshot.queryParamMap.get('userID');
    this.workoutId.set(workoutId ? +workoutId : null);
    this.athleteId.set(athleteId ? +athleteId : null);
    this.idCreator.set(id ? +id : null);

  }

  async goToSuscriptionCreator() {
    const creatorId = this.idCreator();

    // payment-in-app activo: suscripción dentro de la app. En caso contrario,
    // se manda al usuario a la web para ver los planes (modal leave-app).
    const paymentInApp = this._appSettingsService.settings$()?.paymentInApp === '1';
    if (paymentInApp) {
      await this._router.navigate([
        '/home/suscriptions/suscription-creator',
        creatorId,
      ]);
      return;
    }

    const url = `${PLANS_BASE_URL}?creatorId=${creatorId}&athleteId=${this.athleteId()}&workoutId=${this.workoutId()}`;

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

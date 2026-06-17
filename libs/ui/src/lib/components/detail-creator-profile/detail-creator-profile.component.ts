import {
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  input,
  output,
  signal,
  type OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  AppSettingsService,
  LoaderUIService,
  ProfileColorService,
  SesionService,
  UserService,
} from '@monorepo-bb-app/core';
import {
  ProcessSuscriptionService,
  SubscriptionStatus,
  ToastService,
  User,
  WorkoutService,
} from '@monorepo-bb-app/shared';
import { finalize } from 'rxjs';
import {
  IonGrid,
  IonContent,
  IonAvatar,
  IonButton,
  IonChip,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonBackButton,
  IonSkeletonText,
  IonIcon,
} from '@ionic/angular/standalone';
import { LayoutContentComponent } from '../layout-content';
import { ENUM_WORKOUT_TYPES, ENUM_TYPE_USER } from '../../../../../shared/constants/enums';
import { addIcons } from 'ionicons';
import { arrowBackOutline, pencil } from 'ionicons/icons';
import { WorkoutByTypesComponent } from '../workout-by-types/workout-by-types.component';
import { CONSTANTS } from '../../../../../shared/constants/constants';
import { CommonModule } from '@angular/common';
import { Capacitor } from '@capacitor/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'lib-detail-creator-profile',
  imports: [
    CommonModule,
    IonBackButton,
    IonSegmentButton,
    IonSegment,
    IonLabel,
    IonChip,
    IonAvatar,
    IonContent,
    IonGrid,
    LayoutContentComponent,
    IonButton,
    WorkoutByTypesComponent,
    IonSkeletonText,
    IonIcon,
    TranslateModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './detail-creator-profile.component.html',
  styleUrl: './detail-creator-profile.component.scss',
})
export class DetailCreatorProfileComponent implements OnInit {
  idCreator = input.required<number>();
  hasSubscriptionActive = signal<boolean>(false);
  defaultHref = input<string>('/home');
  suscriptionEvent = output<boolean>();
  defaultCoverPicture = CONSTANTS.DEFAULT_FRONT_PAGE_URL;
  public tabActive = signal<number>(ENUM_WORKOUT_TYPES.RUTINE_VIDEO);
  public WORKOUT_TYPES = ENUM_WORKOUT_TYPES;
  public ENUM_TYPE_USER = ENUM_TYPE_USER;
  public isIos = Capacitor.getPlatform() === 'ios';
  public creator = signal<User | null>(null);
  public fullName = computed(() => {
    const creator = this.creator();
    return creator ? `${creator.firstName} ${creator.lastName}` : '';
  });

  // Computed que retorna el color del creador o el color de perfil del usuario logueado
  public creatorColor = computed(
    () => this.creator()?.profileColor || this.colorService.profileColor()
  );

  // Computed que valida si el usuario logueado es el creador (tipo de usuario 2)
  public isCreatorUser = computed(
    () => this._sesionService.user$()?.userTypeId === ENUM_TYPE_USER.CREATOR
  );

  // Bandera payment-in-app de app-settings: '1' habilita el pago dentro de la app
  // ('Suscribirse'); cualquier otro valor muestra 'Ver planes' (manda a la web).
  public paymentInApp = computed(
    () => this._appSettingsService.settings$()?.paymentInApp === '1'
  );

  public defaultProfilePicture = CONSTANTS.DEFAULT_URL_AVATAR;

  constructor(
    private _user: UserService,
    private _router: Router,
    private _toastService: ToastService,
    private _loader: LoaderUIService,
    private _processSuscriptionService: ProcessSuscriptionService,
    private _sesionService: SesionService,
    private _appSettingsService: AppSettingsService,
    public colorService: ProfileColorService
  ) {
    addIcons({ arrowBackOutline, pencil });
  }

  ngOnInit(): void {
    console.log('Initializing Detail Creator Profile Component');
    this.getCreatorProfile();
    this.checkSubscription();
  }

  ionViewWillEnter() {
    console.log('Entering Detail Creator Profile View');
  }

  private getCreatorProfile() {
    this._loader.showLoader();
    this._user
      .getCreatorInfo(this.idCreator())
      .pipe(finalize(() => this._loader.hideLoader()))
      .subscribe({
        next: (user) => {
          this.creator.set(user);
          this._processSuscriptionService.setCreator(user);
        },
        error: (err) => {
          this._toastService.error('Failed to load creator profile.', {
            duration: 1000,
          });
        },
      });
  }

  private checkSubscription() {
    const userId = this._sesionService.user$()?.userId || 0;
    const suscription = this._user.getSubscriptionInformation(userId, this.idCreator()).subscribe({
      next: (resp) => {
        const status = resp.paymentSubscriptionStatus.status === SubscriptionStatus.ACTIVE;
        console.log(status);
        this.hasSubscriptionActive.set(status);
      },
      error: (err) => {
        this.hasSubscriptionActive.set(false);
      },
    });
    return suscription !== null;
  }
  public changeTab(event: any) {
    this.tabActive.set(event.detail.value);
  }

  goToSuscriptionCreator() {
    this.suscriptionEvent.emit(true);
  }

  onEditCoverImage() {
    this._router.navigate([`/home/profile/portada`]);
  }
}

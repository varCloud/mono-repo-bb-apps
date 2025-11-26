import {
  Component,
  computed,
  input,
  output,
  signal,
  type OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  LoaderUIService,
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
} from '@ionic/angular/standalone';
import { LayoutContentComponent } from '../layout-content';
import { ENUM_WORKOUT_TYPES } from '../../../../../shared/constants/enums';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import { WorkoutByTypesComponent } from '../workout-by-types/workout-by-types.component';
import { CONSTANTS } from '../../../../../shared/constants/constants';

@Component({
  selector: 'lib-detail-creator-profile',
  imports: [
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
  ],
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

  public creator = signal<User | null>(null);
  public fullName = computed(() => {
    const creator = this.creator();
    return creator ? `${creator.firstName} ${creator.lastName}` : '';
  });
  public defaultProfilePicture = CONSTANTS.DEFAULT_URL_AVATAR;

  constructor(
    private _user: UserService,
    private _router: Router,
    private _toastService: ToastService,
    private _loader: LoaderUIService,
    private _processSuscriptionService: ProcessSuscriptionService,
    private _sesionService: SesionService
  ) {
    addIcons({ arrowBackOutline });
  }

  ngOnInit(): void {
    this.getCreatorProfile();
    this.checkSubscription();
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
    const suscription = this._user
      .getSubscriptionInformation(userId, this.idCreator())
      .subscribe({
        next: (resp) => {
          const status =
            resp.paymentSubscriptionStatus.status === SubscriptionStatus.ACTIVE;
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
}

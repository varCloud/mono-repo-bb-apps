import { ToastService } from './../../../../../../../../libs/shared/services/toast.service';
import { SuscriptionService } from './../../../../../../../../libs/shared/services/suscription/suscription.service';
import { Component, signal, OnInit, effect } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonButton,
  IonIcon,
  IonButtons,
  IonRefresherContent,
  IonRefresher
} from '@ionic/angular/standalone';
import { HeaderSearchComponent, UserCardComponent, MySubscriptionsSearchModalComponent } from '@monorepo-bb-app/ui';
import { ModalController } from '@ionic/angular/standalone';
import { OptionsSubscritporModalComponent } from '@monorepo-bb-app/ui';

import { CONSTANTS, PaginatorModel, Subscription } from '@monorepo-bb-app/shared';
import { LoaderUIService, SesionService, UserConversationService, UserSuscriptionsIdService } from '@monorepo-bb-app/core';
import { JsonPipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { EmptyElementsComponent } from '@monorepo-bb-app/ui';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, take } from 'rxjs';
import { ENUM_TYPE_USER } from 'libs/shared/constants/enums';
import { TranslateModule, TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-home',
  templateUrl: 'user-subscriptions.component.html',
  styleUrls: ['user-subscriptions.component.scss'],
  standalone: true,
  imports: [
    IonRefresherContent,
    IonContent,
    IonList,
    UserCardComponent,
    OptionsSubscritporModalComponent,
    HeaderSearchComponent,
    CommonModule,
    EmptyElementsComponent,
    ReactiveFormsModule,
    MySubscriptionsSearchModalComponent,
    IonRefresher,
    TranslateModule,

  ],
})
export class UserSubscriptionsComponent implements OnInit {
  subscriptions = signal<Subscription[]>([]);

  public imgUrl = signal<string>('assets/images/empty/emptyelements.png');

  public searchControl = new FormControl('');
  public paginator!: PaginatorModel;
  public readonly DEFAULT_URL_AVATAR = CONSTANTS.DEFAULT_URL_AVATAR;
  constructor(
    private UserSuscriptionsIdService: UserSuscriptionsIdService,
    private modalCtrl: ModalController,
    private _userConversationService: UserConversationService,
    private _loaderUIService: LoaderUIService,
    private router: Router,
    private sesionService: SesionService,
  ) {
    effect(() => {
      this.sesionService.user$().userId
    })
  }

  ngOnInit() {
    this.getSubscriptionsForUser(`/user/${this.sesionService.user$()?.userId}/suscriptions/${ENUM_TYPE_USER.CREATOR}`, { page: CONSTANTS.INFINITELOADER.PAGE, limit: CONSTANTS.INFINITELOADER.LIMIT });
  }

  getSubscriptionsForUser(uri: string = '', params: any = {}): void {
    this.UserSuscriptionsIdService.getSubscriptions(uri, params)
      .pipe()
      .subscribe((data) => {
        this.subscriptions.set([...this.subscriptions(), ...data.subscription]);
        this.paginator = data.paginator;
      })
  }

  loadMoreSubscriptions(event: any) {
    if (this.paginator && this.paginator.links.next) {
      this.getSubscriptionsForUser(this.paginator.links.next);
    }
    event.target.complete();
  }

  async openSearchSubscriptionsModal() {
    const modalSearch = await this.modalCtrl.create({
      component: MySubscriptionsSearchModalComponent,
      componentProps: {
        allSubscriptions: this.subscriptions,
      },
      breakpoints: [0.4, 1],
      initialBreakpoint: 1,
      handle: false,
      cssClass: 'search-modal',
    });
    await modalSearch.present();
  }


  async onShowOptions(subscription: Subscription, event: Event) {
    const modal = await this.modalCtrl.create({
      component: OptionsSubscritporModalComponent,
      componentProps: {
        subscription: this.subscriptions,
      },
      breakpoints: [0.4, 1],
      initialBreakpoint: 0.4,
      handle: false,
      cssClass: 'bottom-sheet-modal-rounded',
    })

    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm' && data?.confirmed) {

    } else if (data?.createConversation) {
      this.createConversation(subscription);
    }

  }


  createConversation(subscription: Subscription) {
    const payload = {
      creatorUserId: subscription.user.id,
      athleteUserId: this.sesionService.user$()?.userId,
      sendMessageUserId: this.sesionService.user$()?.userId
    };
    this._loaderUIService.showLoader();
    this._userConversationService.createConversation(payload).pipe(
      take(1),
      finalize(() => this._loaderUIService.hideLoader())).
      subscribe({
        next: (conversation) => {
          console.log('Conversación seleccionada:', conversation);
          this.router.navigate([`home/${conversation.data.userConversationId}/user-chat`], { state: { conversation: conversation.data }, });
        },
        error: (error) => {
          console.error('Error al crear la conversación:', error);
        }
      });
  }
}

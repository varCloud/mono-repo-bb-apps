import { UserSuscriptionsIdService } from './../../../../../core/services/user-suscriptions-id.service';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Subscription } from '@monorepo-bb-app/shared';
import { CommonModule } from '@angular/common';
import { UserCardComponent } from '../user-card/user-card.component';
import { TranslateModule } from '@ngx-translate/core';
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent, IonHeader, IonInput, IonItem, IonRow, IonSearchbar, IonTitle, IonToolbar, ModalController
} from '@ionic/angular/standalone';
import { ModalHeaderSearchbarComponent } from '../modal-header-searchbar/modal-header-searchbar.component';
import { LoaderUIService, SesionService } from '@monorepo-bb-app/core';
import { ENUM_TYPE_USER, SUBSCRIPTION_STATUS } from 'libs/shared/constants/enums';
import { finalize, take } from 'rxjs';
import { EmptyElementsComponent } from '../empty-elements/empty-elements.component';

@Component({
  selector: 'lib-my-subscription-search-modal-component',
  templateUrl: './my-subscriptions-search-modal.component.html',
  styleUrls: ['./my-subscriptions-search-modal.component.scss'],
  imports: [CommonModule,
    UserCardComponent,
    IonHeader,
    TranslateModule,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonInput,
    IonItem,
    IonContent,
    IonRow,
    IonCol,
    IonSearchbar,
    ModalHeaderSearchbarComponent,
    EmptyElementsComponent
  ],
})
export class MySubscriptionsSearchModalComponent {
  subscriptions = signal<Subscription[]>([]);
  search: string = '';
  url = computed(() => `/user/${this.sesionService.user$()?.userId}/suscriptions/${this.sesionService.user$()?.userTypeId}`);
  messsageList  = 'subscriptions.no-subscriptions';
  constructor(
    private modalCtrl: ModalController,
    private UserSuscriptionsIdService: UserSuscriptionsIdService,
    public _loaderUIService: LoaderUIService,
    private sesionService: SesionService
  ) {

    effect(() => {
      this.sesionService.user$()
    });

  }

  ionViewWillEnter() {
    this.subscriptions.set([]);

    this.getSubscriptionsForUser(this.url(),
      { page: 1, limit: 25, subscriptionStatusId: SUBSCRIPTION_STATUS.ACTIVE }
    );
  }

  getSubscriptionsForUser(uri: string = '', params: any = {}): void {
    this._loaderUIService.showLoader();
    this.UserSuscriptionsIdService.getSubscriptions(uri, params)
      .pipe(finalize(() => this._loaderUIService.hideLoader()),
        take(1)
      )
      .subscribe(
        (data) => {
          this.subscriptions.set([]);
          this.subscriptions.set([...this.subscriptions(), ...data.subscription]);
          if(params.search && params.search.trim() !== '' && this.subscriptions().length === 0){
            this.messsageList = 'subscriptions.no-subscriptions-for-search';
          }
        },
        (error) => {
          console.error('Error fetching subscriptions:', error);
        }
      );
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }


  onSearch(event: Event) {
    const target = event.target as HTMLIonSearchbarElement;
    const query = target.value?.toLowerCase() || '';
    this.search = query;
    this.getSubscriptionsForUser(this.url(), {search: this.search, subscriptionStatusId: SUBSCRIPTION_STATUS.ACTIVE })
  }
}

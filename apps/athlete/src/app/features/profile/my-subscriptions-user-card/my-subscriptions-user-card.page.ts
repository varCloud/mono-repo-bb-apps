import { Component, signal, OnInit} from '@angular/core';
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
// Importamos nuestro nuevo componente
import { HeaderSearchComponent, UserCardComponent } from '@monorepo-bb-app/ui';
import { ModalController } from '@ionic/angular/standalone';
import { OptionsSubscritporModalComponent } from '@monorepo-bb-app/ui';

import { CONSTANTS, PaginatorModel, Subscription} from '@monorepo-bb-app/shared';
import { UserSuscriptionsIdService } from '@monorepo-bb-app/core';
import { JsonPipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { EmptyElementsComponent } from '@monorepo-bb-app/ui';
import { ReactiveFormsModule, FormControl} from '@angular/forms';
import { MySubscriptionsSearchModalComponent } from '@monorepo-bb-app/ui';


@Component({
  selector: 'app-home',
  templateUrl: 'my-subscriptions-user-card.page.html',
  styleUrls: ['my-subscriptions-user-card.page.scss'],
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
    IonRefresher
  ],
})
export class mySubscriptionsUserCardPage implements OnInit {
  subscriptions = signal<Subscription[]>([]);
  public userId = signal<number>(88);
  public subscriptionId = signal<number>(1);
  public imgUrl = signal<string>('assets/images/empty/emptyelements.png');
  public textMessage = signal<string>(
    'Actualmente no tienes suscripciones  Busca entrenamientos y comienza tu sucripción con tu coach favorito.'
  );
  public searchControl = new FormControl('');
  public paginator!: PaginatorModel;
  public readonly DEFAULT_AVATAR = CONSTANTS.DEFAULT_AVATAR;
  constructor(
    private UserSuscriptionsIdService: UserSuscriptionsIdService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.getSubscriptionsForUser(`/user/${this.userId()}/suscriptions/${this.subscriptionId()}`, {page:1, limit:25});
  }

  getSubscriptionsForUser(uri : string = '', params: any = {}): void {
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
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm' && data?.confirmed) {
     // funcion para cancelar suscripcion
    } else if (role === 'share') {
      // opciones de busqueda
    }
    //mostrar opciones para  subscription.user.name
  }


}

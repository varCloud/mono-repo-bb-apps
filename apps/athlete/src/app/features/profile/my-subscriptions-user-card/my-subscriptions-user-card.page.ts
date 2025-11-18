import { Component, signal, OnInit, Input, input } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonButton,
  IonAccordion,
  IonIcon,
  IonButtons,
} from '@ionic/angular/standalone';
// Importamos nuestro nuevo componente
import { HeaderSearchComponent, SimpleSearchInputComponent, UserCardComponent } from '@monorepo-bb-app/ui';
import { ModalController } from '@ionic/angular/standalone';
import { OptionsSubscritporModalComponent } from '@monorepo-bb-app/ui';
import { IonInput, IonSearchbar } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { Subscription, ApiResponse } from '@monorepo-bb-app/shared';
import { UserSuscriptionsIdService } from '@monorepo-bb-app/core';
import { JsonPipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { EmptyElementsComponent } from '@monorepo-bb-app/ui';
import { ReactiveFormsModule, FormControl,FormGroup, Validators } from '@angular/forms';
import { MySubscriptionsSearchModalComponent } from '@monorepo-bb-app/ui';
@Component({
  selector: 'app-home',
  templateUrl: 'my-subscriptions-user-card.page.html',
  styleUrls: ['my-subscriptions-user-card.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    UserCardComponent,
    OptionsSubscritporModalComponent,
    IonButton,
    IonIcon,
    IonButtons,
    HeaderSearchComponent,
    JsonPipe,
    CommonModule,
    EmptyElementsComponent,
    ReactiveFormsModule,
    MySubscriptionsSearchModalComponent,

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

  constructor(
    private UserSuscriptionsIdService: UserSuscriptionsIdService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.getSubscriptionsForUser(this.userId(), this.subscriptionId());
  }

  getSubscriptionsForUser(userId: number, subscriptionId: number): void {
    return console.log(
      this.UserSuscriptionsIdService.getSubscriptions(userId, subscriptionId)
        .pipe()
        .subscribe((subs: Subscription[]) => {
          this.subscriptions.set(subs);
          console.log('Suscripciones obtenidas:', subs);
        })
    );
  }

  async openSearchSubscriptionsModal() {
    const modalSearch = await this.modalCtrl.create({
      component: MySubscriptionsSearchModalComponent, // El componente que creamos
      componentProps: {
        allSubscriptions: this.subscriptions, // Pasa la data de las suscripciones al modal
      },
      breakpoints: [0.4, 1],
      initialBreakpoint: 1,
      handle: false,
      cssClass: 'bottom-sheet-modal',
    });
    await modalSearch.present();

    console.log('Abrir modal de búsqueda de suscripciones');
  }


  async onShowOptions(subscription: Subscription, event: Event) {
    const modal = await this.modalCtrl.create({
      component: OptionsSubscritporModalComponent, // El componente que creamos
      componentProps: {
        subscription: this.subscriptions, // Pasa la data de la suscripción al modal
      },
      breakpoints: [0.4, 1],
      initialBreakpoint: 0.4,
      handle: false,
      cssClass: 'bottom-sheet-modal',
    });
    await modal.present();
    // --- Escucha el resultado cuando el modal se cierra ---
    const { data, role } = await modal.onWillDismiss();
    // Si el 'role' es 'confirm', significa que el usuario
    // presionó "Si, Cancelar plan"
    if (role === 'confirm' && data?.confirmed) {
      console.log('¡CANCELAR LA SUSCRIPCIÓN!', subscription.user.name);
      // Aquí llamas a tu servicio para cancelar
      // this.cancelSubscription(subscription.user.id);
    } else if (role === 'share') {
      console.log('metodo de busqueda aqui');
    }
    console.log('Mostrar opciones para:', subscription.user.name);
  }

  //   cancelSubscription(id: number) {
  //     console.log('Suscripción cancelada y eliminada de la lista:', id);

  //     this.subscriptions.update(subs =>
  //       subs.filter(s => s.user.id !== id)
  //     );
  //   }

  //   async openDetailModal(data?: any) {
  //     const modal = await this.modalCtrl.create({
  //       component: UserCardComponent,
  //       componentProps: {
  //         data: {
  //            allSubscriptions: this.subscriptions(),
  //         },
  //       },
  //       breakpoints: [0, 0.25, 0.5, 0.75, 1],
  //     });

  //     await modal.present();

  //     const result = await modal.onDidDismiss();
  //     if (result.data) {
  //       // Manejar los datos retornados del modal si es necesario
  //       console.log('Modal Data:', result.data);
  //     }
  //   }
}

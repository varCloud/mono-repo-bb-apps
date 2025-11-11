import { Component, signal } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList,IonButton, IonAccordion, IonIcon, IonButtons } from '@ionic/angular/standalone';
// Importamos nuestro nuevo componente
import { HeaderSearchComponent, UserCardComponent } from '@monorepo-bb-app/ui';
import { ModalController } from '@ionic/angular/standalone';
import { OptionsSubscritporModalComponent } from '@monorepo-bb-app/ui';
import { IonSearchbar } from '@ionic/angular';
import { addIcons } from 'ionicons';




// Definimos una interfaz para los datos (¡buena práctica!)
interface Subscription {
  id: number;
  imageUrl: string;
  name: string;
  description: string;
  tag: string;
  tagBg: string;
  tagText: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'my-subscriptions-user-card.page.html',
  styleUrls: ['my-subscriptions-user-card.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonList,
    UserCardComponent, OptionsSubscritporModalComponent, IonButton, IonIcon, IonButtons,HeaderSearchComponent

  ]
})
export class mySubscriptionsUserCardPage {

  // Definimos la lista de suscripciones como un Signal
  subscriptions = signal<Subscription[]>([
    {
      id: 1,
      imageUrl: 'assets/images/gerardo.jpg', // Reemplaza con tus assets
      name: 'Gerardo Contreras',
      description: 'Pago por 3 meses',
      tag: 'Kick boxing',
      tagBg: '#43e3ffff', // Azul claro
      tagText: '#000000ff' // Azul oscuro
    },
    {
      id: 2,
      imageUrl: 'assets/images/alejandro.jpg',
      name: 'Alejandro López',
      description: 'Pago por 3 meses',
      tag: 'Running',
      tagBg: '#aeff6cff', // Verde claro
      tagText: '#333333' // Verde oscuro
    },
    {
      id: 3,
      imageUrl: 'assets/images/brenda.jpg',
      name: 'Brenda Gutiérrez',
      description: 'Pago por 3 meses',
      tag: 'Fitness',
      tagBg: '#a049c2ff', // Morado claro
      tagText: '#ffffff' // Texto blanco (como en tu imagen)
    }
  ]);

  constructor(private modalCtrl: ModalController) {

  }


  async openSearchModal() {
    const modal = await this.modalCtrl.create({
      component: OptionsSubscritporModalComponent,
      componentProps: {
        // Pasa la lista COMPLETA de suscripciones al modal
        allSubscriptions: this.subscriptions()
      },
      breakpoints: [0.4, 1],
      initialBreakpoint: 0.4,
      handle: false,
      cssClass: 'bottom-sheet-modal'
    });

    await modal.present();

    // Opcional: Escucha si el usuario seleccionó un resultado
    const { data, role } = await modal.onWillDismiss();
    if (role === 'selected' && data) {
      console.log('Usuario seleccionó desde búsqueda:', data);
      // Aquí podrías hacer algo, como navegar al detalle de esa suscripción
    }
  }

  // ... (tu método existente 'onShowOptions' no cambia) ...



  // Método para manejar el clic en los '...'




async onShowOptions(subscription: Subscription, event: Event) {

    const modal = await this.modalCtrl.create({
      component: OptionsSubscritporModalComponent, // El componente que creamos
      componentProps: {
        subscription: subscription // Pasa la data de la suscripción al modal
      },

      breakpoints: [0.4, 1],
      initialBreakpoint: 0.4,
      handle: false,
      cssClass: 'bottom-sheet-modal'
    });

    await modal.present();

    // --- Escucha el resultado cuando el modal se cierra ---
    const { data, role } = await modal.onWillDismiss();

    // Si el 'role' es 'confirm', significa que el usuario
    // presionó "Si, Cancelar plan"
    if (role === 'confirm' && data?.confirmed) {
      console.log('¡CANCELAR LA SUSCRIPCIÓN!', subscription.name);
      // Aquí llamas a tu servicio para cancelar
      this.cancelSubscription(subscription.id);
    }else if(role==='share'){
         console.log('metodo de busqueda aqui');
    }
       console.log('Mostrar opciones para:', subscription.name);
  }


  cancelSubscription(id: number) {

    this.subscriptions.update(subs =>
      subs.filter(s => s.id !== id)
    );
    console.log('Suscripción cancelada y eliminada de la lista:', id);
  }


  async openDetailModal(data?: any) {
    const modal = await this.modalCtrl.create({
      component: UserCardComponent,
      componentProps: {
        data: {
           allSubscriptions: this.subscriptions(),
        },
      },
      breakpoints: [0, 0.25, 0.5, 0.75, 1],
    });

    await modal.present();

    const result = await modal.onDidDismiss();
    if (result.data) {
      // Manejar los datos retornados del modal si es necesario
      console.log('Modal Data:', result.data);
    }
  }

}

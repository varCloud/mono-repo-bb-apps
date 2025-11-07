import { Component, signal } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList } from '@ionic/angular/standalone';
// Importamos nuestro nuevo componente
import { UserCardComponent } from '@monorepo-bb-app/ui';
import { ModalController } from '@ionic/angular/standalone';
import { OptionsSubscritporModalComponent } from '@monorepo-bb-app/ui';



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
    UserCardComponent, OptionsSubscritporModalComponent

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
      tagBg: '#e0f7fa', // Azul claro
      tagText: '#00796b' // Azul oscuro
    },
    {
      id: 2,
      imageUrl: 'assets/images/alejandro.jpg',
      name: 'Alejandro López',
      description: 'Pago por 3 meses',
      tag: 'Running',
      tagBg: '#e8f5e9', // Verde claro
      tagText: '#388e3c' // Verde oscuro
    },
    {
      id: 3,
      imageUrl: 'assets/images/brenda.jpg',
      name: 'Brenda Gutiérrez',
      description: 'Pago por 3 meses',
      tag: 'Fitness',
      tagBg: '#e1bee7', // Morado claro
      tagText: '#ffffff' // Texto blanco (como en tu imagen)
    }
  ]);

  constructor(private modalCtrl: ModalController) {}






  // Método para manejar el clic en los '...'

async onShowOptions(subscription: Subscription, event: Event) {

    const modal = await this.modalCtrl.create({
      component: OptionsSubscritporModalComponent, // El componente que creamos
      componentProps: {
        subscription: subscription // Pasa la data de la suscripción al modal
      },
      // --- Estilo de Bottom-Sheet ---
      breakpoints: [0.4, 1],      // Permite que crezca de 0.1 a 1
      initialBreakpoint: 0.4, // Empieza pequeño
      handle: false,            // Oculta el "asa" por defecto (usamos el nuestro)
      cssClass: 'bottom-sheet-modal' // Clase para styling global
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
    }
       console.log('Mostrar opciones para:', subscription.name);
  }

  // Método para manejar la cancelación real
  cancelSubscription(id: number) {
    // Por ahora, solo lo quitamos de la lista
    this.subscriptions.update(subs =>
      subs.filter(s => s.id !== id)
    );
    console.log('Suscripción cancelada y eliminada de la lista:', id);
  }






}

import { Component, computed, inject, input, signal } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from '@monorepo-bb-app/shared';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { UserCardComponent } from '../user-card/user-card.component';

@Component({
  selector: 'lib-my-subscription-search-modal-component',
  templateUrl: './my-subscriptions-search-modal.component.html',
  styleUrls: ['./my-subscriptions-search-modal.component.scss'],
  imports: [CommonModule, UserCardComponent, IonicModule],
})
export class MySubscriptionsSearchModalComponent {

  allSubscriptions = input.required<Subscription[]>();
  private modalCtrl = inject(ModalController);
  searchTerm = signal('');

  constructor() {}

  filteredSubscriptions = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const faqs = this.allSubscriptions();

    if (!term) {
      return faqs; // Si no hay búsqueda, muestra todo
    }
    // Filtra por varios campos
    return faqs.filter(
      (item) =>
        item.user.name.toLowerCase().includes(term) ||
        item.user.nickName.toLowerCase().includes(term)
    );
  });

  dismiss() {
    this.modalCtrl.dismiss();
  }
  // 6. Función que actualiza el signal de búsqueda
  onSearchChange(event: any) {
    this.searchTerm.set(event.detail.value || '');
  }
}

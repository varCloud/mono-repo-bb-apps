import { Component, computed, inject, input, signal } from '@angular/core';
import { Subscription } from '@monorepo-bb-app/shared';
import { CommonModule } from '@angular/common';
import { UserCardComponent } from '../user-card/user-card.component';
import { TranslateModule }  from '@ngx-translate/core';
import { IonButton,
   IonButtons,
    IonCol, 
    IonContent, IonHeader, IonInput, IonItem, IonRow, IonSearchbar, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';

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
    IonSearchbar

  ],
})
export class MySubscriptionsSearchModalComponent {
  allSubscriptions = input.required<Subscription[]>();
  searchTerm = signal('');

  constructor(
    private modalCtrl: ModalController
  ) {}

  filteredSubscriptions = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const faqs = this.allSubscriptions();

    if (!term) {
      return faqs; 
    }
    
    return faqs.filter(
      (item) =>
        item.user.name.toLowerCase().includes(term) ||
        item.user.nickName.toLowerCase().includes(term)
    );
  });

  dismiss() {
    this.modalCtrl.dismiss();
  }
  
  onSearchChange(event: any) {
    this.searchTerm.set(event.detail.value || '');
  }
}

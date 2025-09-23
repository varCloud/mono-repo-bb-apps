import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutContentComponent, HeaderSearchComponent } from '@monorepo-bb-app/ui';
import { ellipsisVertical, sendSharp } from 'ionicons/icons';
import { addIcons } from 'ionicons';

interface Subscription {
  userId: number;
  userName: string;
  avatarUrl: string;
  subscriptionPeriod: string;
}

@Component({
  selector: 'app-user-subscriptions',
  templateUrl: './user-subscriptions.component.html',
  styleUrls: ['./user-subscriptions.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutContentComponent,
    HeaderSearchComponent,
  ],
})
export class UserSubscriptionsComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  constructor() {
    // Mock data for testing
    this.subscriptions = [
      {
        userId: 1,
        userName: 'Gerardo Contreras',
        avatarUrl:
          'https://bb-app-bucket-images.s3.amazonaws.com/uploads%2F75%2F1000127915.1756618728336_1756618743696_f17iz8vhqtv.jpeg',
        subscriptionPeriod: 'Pago por 3 meses',
      },
    ];
    addIcons({ sendSharp, ellipsisVertical });
  }

  ngOnInit(): void {
    // Initialize component
  }

  ngOnDestroy(): void {
    // Cleanup when component is destroyed
  }

  async openDetailModal(data?: any) {}
}

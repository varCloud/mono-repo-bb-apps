import { Routes } from '@angular/router';

export const userSubscriptionsRoutes: Routes = [
  {
    path: 'user-subscriptions',
    loadComponent: () =>
      import('./pages/user-subscriptions/user-subscriptions.component').then(
        (m) => m.UserSubscriptionsComponent,
      ),
  },
];

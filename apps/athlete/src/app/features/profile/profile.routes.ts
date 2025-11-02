import { Routes } from '@angular/router';

export const profileRoutes: Routes = [
  {
    path: 'profile',

    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/profile/profile.component').then(
            (m) => m.ProfileComponent
          ),
      },
      {
        path: 'payment-methods',
        loadComponent: () =>
          import(
            './pages/payment-methods-page/payment-methods-page.component'
          ).then((m) => m.PaymentMethodsPageComponent),
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
      },
    ],
  },
];

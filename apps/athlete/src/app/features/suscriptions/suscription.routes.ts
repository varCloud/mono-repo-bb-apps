import { Routes } from '@angular/router';

export const suscriptionRoutes: Routes = [
  {
    path: 'suscriptions',
    children: [
      {
        path: 'profile-creator/:id',
        loadComponent: () =>
          import(
            './page/detail-creator-profile/detail-creator-profile.component'
          ).then((m) => m.DetailCreatorProfilePageComponent),
      },
      {
        path: 'suscription-creator/:id',
        loadComponent: () =>
          import(
            './page/detail-suscription-creator/detail-suscription-creator.component'
          ).then((m) => m.DetailSuscriptionCreatorComponent),
      },
      {
        path: 'payment-methods',
        loadComponent: () =>
          import(
            '../suscriptions/page/payment-methods-page/payment-methods-page.component'
          ).then((m) => m.PaymentMethodsPageComponent),
      },
      {
        path: 'checkout',
        loadComponent: () =>
          import(
            './page/checkout-suscription/checkout-suscription.component'
          ).then((m) => m.CheckoutSuscriptionComponent),
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
      },
    ],
  },
];

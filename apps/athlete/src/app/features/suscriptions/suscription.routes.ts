import { Routes } from '@angular/router';

export const suscriptionRoutes: Routes = [
  {
    path: 'suscriptions',
    children: [
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

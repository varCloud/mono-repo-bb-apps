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
        path: 'home-support',
        loadComponent: () =>
          import('./home-support/home-support.component').then(
            (m) => m.HomeSupport
          ),
      },
      {
        path: 'become-creator-detail',
        loadComponent: () =>
          import('./become-creator-detail/become-creator-detail.page').then(
            (m) => m.BecomeCreatorDetailComponent
          ),
      },
      {
        path: 'how-create-account',
        loadComponent: () =>
          import('./how-create-account/how-create-account.page').then(
            (m) => m.BecomeCreatorDetailComponent
          ),
      },
      {
        path: 'my-subscriptions',
        loadComponent: () =>
          import(
            './my-subscriptions/my-subscriptions'
          ).then((m) => m.MySubscriptionsPage),
      },
      {
        path: 'personal-data',
        loadComponent: () =>
          import('./pages/personal-data/personal-data-page.component').then(
            (m) => m.PersonalDataPageComponent
          ),
      },
      {
        path: 'payment-methods',
        loadComponent: () =>
          import('./pages/payment-methods/payment-methods-page.component').then(
            (m) => m.PaymentMethodsPageComponent
          ),
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
      },
    ],
  },
  // {
  //   path: 'personal-data',
  //   loadComponent: () =>
  //     import('./pages/personal-data/personal-data-page.component').then(
  //       (m) => m.PersonalDataPageComponent,
  //     )
  // }
];

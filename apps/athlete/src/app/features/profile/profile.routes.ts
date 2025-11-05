import { Routes } from '@angular/router';

export const profileRoutes: Routes = [
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile.component').then(
        (m) => m.ProfileComponent,
      )
  },
    {
      path: 'homesupport',
      loadComponent: () =>
      import('./homesupport/homesupport.component').then(
        (m) => m.homesupport,
      )
    },
    {
      path: 'profile/become-creator-detail',
      loadComponent: () =>
      import('./become-creator-detail/become-creator-detail.page').then(
        (m) => m.BecomeCreatorDetailComponent,
      )
    },
    {
      path: 'profile/how-create-account',
      loadComponent: () =>
      import('./how-create-account/how-create-account.page').then(
        (m) => m.BecomeCreatorDetailComponent,
      )
    },
];

import { Routes } from '@angular/router';

export const trainingRoutes: Routes = [
  {
    path: 'training',
    // loadComponent: () =>
    //   import('./pages/home/home.component').then((m) => m.HomeComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'profile-creator/:id',
        loadComponent: () =>
          import(
            './pages/detail-creator-profile/detail-creator-profile.component'
          ).then((m) => m.DetailCreatorProfilePageComponent),
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
      },
    ],
  },
];

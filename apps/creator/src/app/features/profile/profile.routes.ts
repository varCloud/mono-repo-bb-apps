import { Routes } from '@angular/router';

export const profileRoutes: Routes = [
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile.component').then(
        (m) => m.ProfileComponent,
      ),
  },
    {
    path: 'personal-data',
    loadComponent: () =>
      import('./pages/personal-data/personal-data.page').then(
        (m) => m.PersonalDataPage,
      ),
  },
];

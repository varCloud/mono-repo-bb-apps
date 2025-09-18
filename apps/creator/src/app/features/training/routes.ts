import { Routes } from '@angular/router';

export const trainingRoutes: Routes = [
  {
    path: 'training',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
];

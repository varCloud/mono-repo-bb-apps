import { Routes } from '@angular/router';
import { authGuard } from 'libs/core/guard/auth.guard';

export const trainingRoutes: Routes = [
  {
    path: 'training',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
      },
    ],
  },
];

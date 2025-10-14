import { Routes } from '@angular/router';
import { authGuard } from '@monorepo-bb-app/core';
import { profileRoutes } from '../profile/profile.routes';

export const homeRoutes: Routes = [
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    children: [
      ...profileRoutes,
    ]
    //   {
    //     path: '',
    //     redirectTo: '/home/training',
    //     pathMatch: 'full',
    //   },
    //   {
    //     path: '**',
    //     redirectTo: '/home/training',
    //     pathMatch: 'full',
    //   },
    // ],
  },
];

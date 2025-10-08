import { Routes } from '@angular/router';

import { authGuard } from '@monorepo-bb-app/core';


export const homeRoutes: Routes = [
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    // children: [
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

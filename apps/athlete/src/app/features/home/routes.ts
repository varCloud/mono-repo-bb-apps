import { Routes } from '@angular/router';
import { authGuard } from '@monorepo-bb-app/core';
import { profileRoutes } from '../profile/profile.routes';
import { userConversationRoutes } from '../user-conversation/user-conversation.routes';

export const homeRoutes: Routes = [
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    children: [
      ...profileRoutes,
      ...userConversationRoutes
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

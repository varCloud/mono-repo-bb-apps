import { Routes } from '@angular/router';
import { trainingRoutes } from '../training/routes';
import { authGuard } from '@monorepo-bb-app/core';
import { profileRoutes } from '../profile/profile.routes';
import { workoutRoutes } from '../workout/routes';
import { userConversationRoutes } from '../user-conversation/user-conversation.routes';
import { userSubscriptionsRoutes } from '../user-subscriptions/user-subscriptions.routes';

export const homeRoutes: Routes = [
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    children: [
      ...trainingRoutes,
      ...profileRoutes,
      ...workoutRoutes,
      ...userConversationRoutes,
      ...userSubscriptionsRoutes,
      {
        path: '',
        redirectTo: '/home/training',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: '/home/training',
        pathMatch: 'full',
      },
    ],
  },
];

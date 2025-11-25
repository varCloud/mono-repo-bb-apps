import { Routes } from '@angular/router';
import { authGuard } from '@monorepo-bb-app/core';
import { profileRoutes } from '../profile/profile.routes';
import { userConversationRoutes } from '../user-conversation/user-conversation.routes';
import { trainingRoutes } from '../training/routes';
import { suscriptionRoutes } from '../suscriptions/suscription.routes';
import { workoutRoutes } from '../workouts/routes';

export const homeRoutes: Routes = [
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    children: [
      ...trainingRoutes,
      ...profileRoutes,
      ...userConversationRoutes,
      ...suscriptionRoutes,
      ...workoutRoutes,
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

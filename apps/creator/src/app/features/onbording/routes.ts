import { Routes } from '@angular/router';
import { loggedInGuard } from '@monorepo-bb-app/core';

export const onboardingRoutes: Routes = [
  {
    path: 'onbording',
    canActivate: [loggedInGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/onboarding/onboarding.component').then(
            (m) => m.OnboardingComponent,
          ),
      },
      {
        path: 'steps',
        loadComponent: () =>
          import(
            './components/steps-onbording/steps-onboarding.component'
          ).then((m) => m.StepsOnboardingComponent),
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
      },
    ],
  },
];

import { Route } from '@angular/router';
import { onboardingRoutes } from './features/onbording/routes';

export const AppRoutes: Route[] = [
  ...onboardingRoutes,
  {
    path: '',
    redirectTo: 'onbording',
    pathMatch: 'full',
  },
];

import { Route } from '@angular/router';
import { onboardingRoutes } from './features/onbording/routes';
import { loginRoutes } from './features/login/routes';

export const AppRoutes: Route[] = [
  ...onboardingRoutes,
  ...loginRoutes,
  {
    path: '',
    redirectTo: 'onbording',
    pathMatch: 'full',
  },
];

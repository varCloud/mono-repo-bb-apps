import { Route } from '@angular/router';
import { onboardingRoutes } from './features/onbording/routes';
import { loginRoutes } from './features/login/routes';
import { homeRoutes } from './features/home/routes';

export const AppRoutes: Route[] = [
  ...homeRoutes,
  ...onboardingRoutes,
  ...loginRoutes,
  {
    path: '',
    redirectTo: 'onbording',
    pathMatch: 'full',
  },
];

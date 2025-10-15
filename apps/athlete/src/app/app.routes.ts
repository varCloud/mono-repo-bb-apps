import { Route } from '@angular/router';
import { onboardingRoutes } from './features/onbording/routes';
import { loginRoutes } from './features/login/routes';
import { homeRoutes } from './features/home/routes';
import { onboardingUserRoutes } from './features/user/routes';

export const AppRoutes: Route[] = [
  ...homeRoutes,
  ...onboardingRoutes,
  ...onboardingUserRoutes,
  ...loginRoutes,
  {
    path: '',
    redirectTo: 'onbording',
    pathMatch: 'full',
  },
];

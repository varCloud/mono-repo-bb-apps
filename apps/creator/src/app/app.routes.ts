import { Route } from '@angular/router';
import { loginRoutes } from './features/login/routes';
import { onboardingRoutes } from './features/onbording/routes';
import { userRoutes } from './features/user/routes';
import { homeRoutes } from './features/home/routes';

export const appRoutes: Route[] = [
  ...homeRoutes,
  ...onboardingRoutes,
  ...loginRoutes,
  ...userRoutes,
  {
    path: '',
    redirectTo: 'onbording',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'workouts',
  },
    
];

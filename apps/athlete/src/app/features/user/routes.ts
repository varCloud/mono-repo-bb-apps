import { Routes } from '@angular/router';
import { loggedInGuard } from '@monorepo-bb-app/core';

export const onboardingUserRoutes: Routes = [
    {
    path: 'create-account',
    canActivate: [loggedInGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/create-account/create-account.component').then(
            (m) => m.CreateAccountComponent,
          ),
      },
      {
        path: 'otp',
        loadComponent: () =>
          import('./pages/create-account/otp/otp.component').then(
            (m) => m.OtpCreateAccountComponent,
          ),
      },

      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
  {
    path: 'profile-incomplete',
    children: [
      {
        path: 'tell-about-us',
        loadComponent: () =>
          import('../user/pages/profile-incomplete/tell-about-us/tell-about-us.component').then(
            (m) => m.TellAboutUsComponent,
          ),
      },
      {
        path: 'select-goals',
        loadComponent: () =>
          import('../user/pages/profile-incomplete/select-goals/select-goals.component').then(
            (m) => m.SelectGoalsComponent,
          ),
      },
      {
        path: 'select-level',
        loadComponent: () =>
          import('../user/pages/profile-incomplete/select-level/select-level.component').then(
            (m) => m.SelectLevelComponent,
          ),
      },
      {
        path: 'profile-setup',
        loadComponent: () =>
          import('../user/pages/profile-incomplete/profile-setup/profile-setup.component').then(
            (m) => m.ProfileSetupComponent,
          ),
      },
      {
        path: '',
        redirectTo: 'tell-about-us',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: 'tell-about-us',
        pathMatch: 'full',
      },
    ],
  },
];

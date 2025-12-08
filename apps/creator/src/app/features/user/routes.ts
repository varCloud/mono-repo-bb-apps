import { Routes } from '@angular/router';
import { authGuard, loggedInGuard } from '@monorepo-bb-app/core';

export const userRoutes: Routes = [
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
    canActivate: [authGuard],
    data: { isProfileIncomplete: true },
    children: [
      {
        path: 'categories',
        loadComponent: () =>
          import(
            './pages/profile-incomplete/categories/categories.component'
          ).then((m) => m.CategoriesComponent),
      },
      {
        path: 'payment-frequency',
        loadComponent: () =>
          import(
            './pages/profile-incomplete/payment-frequency/payment-frequency.component'
          ).then((m) => m.PaymentFrequencyComponent),
      },
      {
        path: 'about-me',
        loadComponent: () =>
          import('./pages/profile-incomplete/about-me/about-me.component').then(
            (m) => m.AboutMeComponent,
          ),
      },
            {
        path: 'about-me2',
        loadComponent: () =>
          import('./pages/profile-incomplete/about-me2/about-me2.component').then(
            (m) => m.AboutMeComponent2,
          ),
      },
      {
        path: 'complete-profile',
        loadComponent: () =>
          import(
            './pages/profile-incomplete/complete-profile/complete-profile.component'
          ).then((m) => m.CompleteProfileComponent),
      },
      {
        path: '**',
        redirectTo: 'categories',
      },
    ],
  },
];

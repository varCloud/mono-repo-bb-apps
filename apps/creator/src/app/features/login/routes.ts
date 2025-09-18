import { Routes } from '@angular/router';
import { loggedInGuard } from '@monorepo-bb-app/core';
import { API_URLS, environment } from '@monorepo-bb-app/shared';


export const loginRoutes: Routes = [
  {
    path: 'login',
    canActivate: [loggedInGuard],
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'forgot-password',
    canActivate: [loggedInGuard],
    loadComponent: () =>
      import('./pages/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent,
      ),
  },
  {
    path: 'validate-otp-forgot-password',
    canActivate: [loggedInGuard],
    loadComponent: () =>
      import(
        './pages/forgot-password/components/validate-otp-reset-password/validate-otp-reset-password.component'
      ).then((m) => m.ValidateOtpResetPasswordComponent),
  },
  {
    path: 'reset-password-forgot-password',
    canActivate: [loggedInGuard],
    loadComponent: () =>
      import(
        './pages/forgot-password/components/reset-password/reset-password.component'
      ).then((m) => m.ResetPasswordComponent),
  },
];
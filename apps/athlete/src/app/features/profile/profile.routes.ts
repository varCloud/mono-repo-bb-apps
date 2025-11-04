import { Routes } from '@angular/router';

export const profileRoutes: Routes = [
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile.component').then(
        (m) => m.ProfileComponent,
      )
  },
    {
    path: 'support',
    loadComponent: () =>
      import('./support/toolbar/toolbar.component').then(
        (m) => m.ToolBarComponent,
      )
  },
    {
      path: 'homesupport',
      loadComponent: () =>
      import('./homesupport/homesupport.component').then(
        (m) => m.homesupport,
      )
    },
        {
      path: 'becomecreatordetail',
      loadComponent: () =>
      import('./become-creator-detail/become-creator-detail.page').then(
        (m) => m.BecomeCreatorDetailComponent,
      )
    },
];

import { Routes } from '@angular/router';

export const workoutRoutes: Routes = [
  {
    path: 'workouts',
    children: [
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/detail-rutine/detail-rutine').then(
            (m) => m.DetailRutine
          ),
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
      },
    ],
  },
];

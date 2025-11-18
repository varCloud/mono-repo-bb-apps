import { Routes } from '@angular/router';

export const trainingRoutes: Routes = [
  {
    path: 'training',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'video/:id',
        loadComponent: () =>
          import('./pages/video-player/video-player.page').then(
            (m) => m.VideoPlayerPage
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

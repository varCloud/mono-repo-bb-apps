import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    loadChildren: () => import('./app.routes').then(m => m.routes)
  }
];

import { Routes } from '@angular/router';
import { checkSubscriptionGuard } from '../../../../../../libs/shared/guards/check-subscription.guard';
import { WorkoutDataResolver } from '../../../../../../libs/shared/services/resolvers/detail-workout-resolver';

export const workoutRoutes: Routes = [
  {
    path: 'workouts',
    children: [
      {
        path: ':workoutId/:creatorId/:userId',
        canActivate: [checkSubscriptionGuard],
        resolve: {
          workout: WorkoutDataResolver,
        },
        loadComponent: () =>
          import('./pages/detail-workout/detail-workout').then(
            (m) => m.DetailWorkout
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

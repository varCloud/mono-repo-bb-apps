import { Routes } from '@angular/router';
import { checkSubscriptionGuard } from '../../../../../../libs/shared/guards/check-subscription.guard';
import { WorkoutDataResolver } from '../../../../../../libs/shared/services/resolvers/detail-workout-resolver';
import { WorkoutAssetDataResolver } from '../../../../../../libs/shared/services/resolvers/detail-workout-asset.resolvert';

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
          import('./pages/detail-workout/detail-workout').then((m) => m.DetailWorkout),
      },
      {
        path: 'workoutAsset/:workoutId/:creatorId/:userId/:workoutAssetIdP',
        canActivate: [checkSubscriptionGuard],
        resolve: {
          workout: WorkoutAssetDataResolver,
        },
        loadComponent: () =>
          import('./pages/detail-workout-asset/detail-workout-asset').then(
            (m) => m.DetailWorkoutAsset
          ),
      },
      {
        path: 'favorites',
        loadComponent: () =>
          import('./pages/favorites/favorites.component').then((m) => m.FavoritesComponent),
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
      },
    ],
  },
];

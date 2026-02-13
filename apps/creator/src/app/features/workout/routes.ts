import { WorkoutAssetDataResolver } from './../../../../../../libs/shared/services/resolvers/detail-workout-asset.resolvert';
import { WorkoutDataResolver } from './../../../../../../libs/shared/services/resolvers/detail-workout-resolver';
import { Routes } from '@angular/router';

export const workoutRoutes: Routes = [
  {
    path: 'workouts',
    loadComponent: () =>
      import('./pages/workout/workout.component').then(
        (m) => m.WorkoutComponent,
      ),
  },
  {
    path: 'workouts/:workoutId/:creatorId/:userId',
    resolve: {
      workout: WorkoutDataResolver,
    },
    loadComponent: () =>
      import('./pages/detail-workout/detail-workout').then((m) => m.DetailWorkout),
  },
  {
        path: 'workouts/workoutAsset/:workoutId/:creatorId/:userId/:workoutAssetIdP',
        resolve: {
          workout: WorkoutAssetDataResolver,
        },
        loadComponent: () =>
          import('./pages/detail-workout-asset/detail-workout-asset').then(
            (m) => m.DetailWorkoutAsset
          ),
      },
  {
    path: 'workouts/create-recorded-class',
    loadComponent: () =>
      import('./components/recorded-class/recorded-class.component').then(
        (m) => m.RecordedClassComponent,
      ),
  },
  {
    path: 'workouts/create-routine',
    loadComponent: () =>
      import('./components/routine/routine.component').then(
        (m) => m.RoutineComponent,
      ),
  },
  {
    path: 'workouts/create-document',
    loadComponent: () =>
      import('./components/document/document.component').then(
        (m) => m.DocumentComponent,
      ),
  },
];

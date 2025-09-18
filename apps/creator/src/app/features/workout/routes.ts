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

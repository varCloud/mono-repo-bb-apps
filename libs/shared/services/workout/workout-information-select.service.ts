import { Injectable, signal } from '@angular/core';
import { User } from '../../models/user.model';
import { Workout } from '../../models/workout-response-list';

@Injectable({
  providedIn: 'root',
})
export class WorkoutInformationSelect {
  private creator = signal<User | null>(null);
  private workout = signal<Workout | null>(null);

  constructor() {}

  setCreator(creator: User) {
    this.creator.set(creator);
  }

  getCreator() {
    return this.creator();
  }

  setWorkout(workout: Workout) {
    this.workout.set(workout);
  }

  getWorkout() {
    return this.workout();
  }

  clear() {
    this.creator.set(null);
    this.workout.set(null);
  }
}

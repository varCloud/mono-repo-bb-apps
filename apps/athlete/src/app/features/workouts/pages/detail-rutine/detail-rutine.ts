import { Component, type OnInit } from '@angular/core';
import { WorkoutService } from '@monorepo-bb-app/shared';

@Component({
  selector: 'app-detail-rutine',
  imports: [],
  templateUrl: './detail-rutine.html',
  styleUrl: './detail-rutine.scss',
})
export class DetailRutine implements OnInit {
  constructor(private workoutService: WorkoutService) {}

  ngOnInit(): void {
    console.log('kjkjhkjhkjhkjhkjh');
    this.workoutService.getWorkoutById(58).then((workout) => {
      console.log('Workout loaded:', workout);
    });
  }
}

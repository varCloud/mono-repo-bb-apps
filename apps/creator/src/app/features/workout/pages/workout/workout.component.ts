import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { addOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { TrainingSelectionComponent } from '../../components/training-selection/training-selection.component';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.component.html',
  styleUrls: ['./workout.component.scss'],
  standalone: true,
  imports: [CommonModule, TrainingSelectionComponent],
})
export class WorkoutComponent implements OnInit {
  workouts: any[] = []; // This would be populated from a service

  constructor(private router: Router) {
    addIcons({ addOutline });
  }

  ngOnInit() {
    // Here you would call a service to get workouts
  }

  navigateToCreateWorkout() {
    this.router.navigate(['/workout/create']);
  }

  onTypeSelected(typeId: any) {
    this.router.navigate(['/workout/create']);
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonFab,
  IonFabButton,
  IonHeader,
  IonToolbar,
  IonTitle,
} from '@ionic/angular/standalone';
import { addOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { TrainingSelectionComponent } from '../../components/training-selection/training-selection.component';
import { FileUploadComponent } from '../../components/file-upload/file-upload/file-upload.component';
import { UppyS3UploadComponent } from '../../components/file-upload/uppy-s3-upload/uppy-s3-upload.component';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.component.html',
  styleUrls: ['./workout.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonIcon,
    IonFab,
    IonFabButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    TrainingSelectionComponent,
    FileUploadComponent,
    UppyS3UploadComponent,
  ],
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

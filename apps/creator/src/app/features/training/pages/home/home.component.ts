import { Component } from '@angular/core';
import { addIcons } from 'ionicons';
import {
  barbell,
  bookmark,
  heart,
  search,
  notifications,
} from 'ionicons/icons';
import {
  IonIcon,
  IonButton,
  IonContent,
  IonHeader,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [IonButton, IonIcon, IonContent, IonHeader],
})
export class HomeComponent {
  constructor(private router: Router) {
    addIcons({ barbell, heart, bookmark, search, notifications });
  }

  onNewWorkoutClick() {
    this.router.navigate(['home/workouts']);
  }
}

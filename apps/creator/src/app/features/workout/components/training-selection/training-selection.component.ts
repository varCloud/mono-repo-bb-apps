import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/angular/standalone';

import { LayoutContentComponent, TrainingTypeSelectionComponent } from '@monorepo-bb-app/ui';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-training-selection',
  templateUrl: './training-selection.component.html',
  styleUrls: ['./training-selection.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    TrainingTypeSelectionComponent,
    LayoutContentComponent,
    TranslateModule,
  ],
})
export class TrainingSelectionComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  onTypeSelected(typeId: string) {
    console.log('Selected training type:', typeId);
    switch (typeId) {
      case 'recorded-classes':
        this.router.navigateByUrl('home/workouts/create-recorded-class');
        break;
      case 'routines':
        this.router.navigateByUrl('home/workouts/create-routine');
        break;
      case 'document':
        this.router.navigate(['home/workouts/create-document']);
        break;
      default:
        console.error('Unknown training type:', typeId);
    }
  }
}

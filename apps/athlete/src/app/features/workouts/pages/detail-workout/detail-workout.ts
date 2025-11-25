import {
  ChangeDetectionStrategy,
  Component,
  signal,
  type OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  IonButton,
  IonGrid,
  IonCol,
  IonRow,
  IonContent,
  IonBackButton,
  IonText,
  IonIcon,
} from '@ionic/angular/standalone';
import { LayoutContentComponent } from '@monorepo-bb-app/ui';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';

@Component({
  selector: 'app-detail-workout',
  imports: [
    IonIcon,
    IonText,
    IonBackButton,
    IonContent,
    IonRow,
    IonCol,
    IonGrid,
    IonButton,
    LayoutContentComponent,
    TranslateModule,
  ],
  templateUrl: './detail-workout.html',
  styleUrl: './detail-workout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailWorkout implements OnInit {
  isFavorite = signal<boolean>(false);
  data = this.activatedRoute.snapshot.data['workout'];
  constructor(private activatedRoute: ActivatedRoute) {
    addIcons({ heart, heartOutline });
  }
  ngOnInit(): void {}

  toggleFavorite($event: Event) {
    this.isFavorite.set(!this.isFavorite());
  }
}

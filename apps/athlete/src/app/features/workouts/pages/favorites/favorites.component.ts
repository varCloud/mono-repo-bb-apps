import { Component, signal, type OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonHeader,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonContent,
  IonToolbar,
  IonSearchbar,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/angular/standalone';
import { LoaderUIService, LocalStorageService, SesionService } from '@monorepo-bb-app/core';
import {
  Favorite,
  KEY_LOCALSTORAGE,
  Paginator,
  WorkoutListModel,
  WorkoutService,
} from '@monorepo-bb-app/shared';
import { CardListComponent } from '@monorepo-bb-app/ui';
import { TranslateModule } from '@ngx-translate/core';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-favorites',
  imports: [
    IonCol,
    IonRow,
    IonGrid,
    IonSearchbar,
    IonToolbar,
    IonContent,
    IonInfiniteScrollContent,
    IonInfiniteScroll,
    IonHeader,
    TranslateModule,
    CardListComponent,
  ],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',
})
export class FavoritesComponent implements OnInit {
  paginator = signal<Paginator>({} as Paginator);
  favorites = signal<Favorite[]>([]);

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _localStorage: LocalStorageService,
    private _loader: LoaderUIService,
    private _sesionService: SesionService,
    private _workoutService: WorkoutService
  ) {}

  ngOnInit(): void {}

  ionViewWillEnter() {
    this.getfavorites();
  }

  async clickCard(workout: WorkoutListModel) {
    const user = await this._localStorage.get(KEY_LOCALSTORAGE.USER);
    this.router.navigate(['home/workouts', workout.workoutId, workout.creatorId, user.userId]);
  }

  getfavorites() {
    this._loader.showLoader();
    const user = this._sesionService.user$();
    return this._workoutService
      .getFavoritesByUser(user.userId)
      .pipe(finalize(() => this._loader.hideLoader()))
      .subscribe({
        next: (resp) => {
          this.favorites.set(resp.data);
          this.paginator.set(resp.paginator);
        },
        error: () => {
          this.favorites.set([]);
          this.paginator.set({} as Paginator);
        },
      });
  }

  clickFavorite(workout: WorkoutListModel) {
    this.getfavorites();
  }
}

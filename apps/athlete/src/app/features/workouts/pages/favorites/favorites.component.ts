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
  IonBackButton,
  IonButton,
  IonButtons,
} from '@ionic/angular/standalone';
import { LoaderUIService, LocalStorageService, SesionService } from '@monorepo-bb-app/core';
import {
  Favorite,
  KEY_LOCALSTORAGE,
  Paginator,
  WorkoutListModel,
  WorkoutService,
} from '@monorepo-bb-app/shared';
import { CardListComponent, EmptyElementsComponent, ModalHeaderSearchbarComponent } from '@monorepo-bb-app/ui';
import { TranslateModule } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-favorites',
  imports: [
    IonButtons,
    IonButton,
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
    IonBackButton,
    ModalHeaderSearchbarComponent,
    EmptyElementsComponent
  ],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',
})
export class FavoritesComponent implements OnInit {
  searchValue = signal<string>('');
  paginator = signal<Paginator>({} as Paginator);
  favorites = signal<Favorite[]>([]);
  isInfiniteScrollDisabled = signal<boolean>(false);
  public messsageList = 'favorites.no-favorites';
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _localStorage: LocalStorageService,
    public _loader: LoaderUIService,
    private _sesionService: SesionService,
    private _workoutService: WorkoutService
  ) {
    addIcons({ arrowBackOutline });
  }

  ngOnInit(): void { }

  ionViewWillEnter() {
    this.getfavorites(undefined, true);
  }

  async clickCard(workout: WorkoutListModel) {
    const user = await this._localStorage.get(KEY_LOCALSTORAGE.USER);
    this.router.navigate(['home/workouts', workout.workoutId, workout.creatorId, user.userId]);
  }

  getfavorites(url = undefined, refresh = false) {
    this._loader.showLoader();
    const user = this._sesionService.user$();
    this.messsageList = 'favorites.no-favorites';
    return this._workoutService
      .getFavoritesByUser(url, user.userId, this.getParameters())
      .pipe(finalize(() => this._loader.hideLoader()))
      .subscribe({
        next: (resp) => {
          if (refresh) {
            this.favorites.set(resp.data);
            if (resp.data.length === 0) {
              this.messsageList = 'favorites.no-favorites-for-search';
            }
          } else {
            this.favorites.update((favorites) => [...favorites, ...resp.data]);
          }
          this.paginator.set(resp.paginator);
          this.isInfiniteScrollDisabled.set(!resp.paginator.links.next);
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

  onDismiss(){
    this.router.navigate(['home/training']);
  }

  onSearch(event: Event) {
    const target = event.target as HTMLIonSearchbarElement;
    const query = target.value?.toLowerCase() || '';
    this.searchValue.set(query);
    this.getfavorites(undefined, true);
  }

  async onIonInfinite(event: any) {
    if (this.paginator()?.links?.next) {
      await this.getfavorites(this.paginator().links.next as string);
    }
    event.target.complete();
  }

  private getParameters() {
    const params: any = {};
    const search = this.searchValue();
    if (search && search.length > 0) {
      params.search = search;
    }
    return params;
  }
}

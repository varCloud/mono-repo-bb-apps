import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { API_URLS } from '../../constants/api-urls';
import { firstValueFrom, map, tap } from 'rxjs';
import { WorkoutListModel } from '../../models/workout-response-list';
import { PaginatorModel } from 'libs/shared/models/paginator';
import { RatingModel } from '../../models/rating.model';
import { Favorite } from 'libs/shared/models/workout-favorites';
import { LoaderUIService, LocalStorageService, SesionService } from '@monorepo-bb-app/core';
import { ToastService } from '../toast.service';
import { TranslateService } from '@ngx-translate/core';
import { ModalController } from '@ionic/angular/standalone';
import { MODAL_RESPONSE } from 'libs/shared/constants/enums';
import { KEY_LOCALSTORAGE } from 'libs/shared/constants/key-localstorage';
import { RemoveFavoriteModalComponent } from '@monorepo-bb-app/ui';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  private readonly BASE_URL = environment.API_URL;
  constructor(
    private _http: HttpClient,
    private sesionService: SesionService,
    private _toastService: ToastService,
    private _translateService: TranslateService,
    private modalCtrl: ModalController,
    private _localStarageService: LocalStorageService,
    private _loaderUIService: LoaderUIService
  ) {}

  public createWorkout(payload: any) {
    return this._http.post(`${this.BASE_URL}${API_URLS.WORKOUT}`, payload);
  }

  public async getWorkouts(url = API_URLS.WORKOUT, params = {}) {
    const $observer = this._http
      .get(`${this.BASE_URL}${url}`, {
        params: new HttpParams({ fromObject: params }),
      })
      .pipe(
        map((res: any) => {
          const data = res.data.workouts.map((item: any) => new WorkoutListModel(item));
          return {
            paginator: new PaginatorModel(res.data),
            data: data,
          };
        })
      );
    return await firstValueFrom($observer);
  }

  public async getWorkoutMaxLikes(idCreator: number) {
    const $observer = this._http
      .get(`${this.BASE_URL}${API_URLS.WORKOUT}/${idCreator}/max-likes`)
      .pipe(
        map((res: any) => {
          return new WorkoutListModel(res.data);
        })
      );
    return await firstValueFrom($observer);
  }

  public async getWorkoutById(id: number) {
    const $observer = this._http.get(`${this.BASE_URL}${API_URLS.WORKOUT}/${id}`).pipe(
      map((res: any) => {
        return res.data;
      })
    );
    return await firstValueFrom($observer);
  }

  public getWorkoutBySubs(id: number) {
    return this._http.get(`${this.BASE_URL}${API_URLS.WORKOUT}/${id}`).pipe(
      map((res: any) => {
        return res.data;
      })
    );
  }

  public workoutRate(workoutId: number, rating: number, comment: string) {
    return this._http
      .post(`${this.BASE_URL}${API_URLS.WORKOUT_RATINGS}/${workoutId}/rate`, {
        rating,
        comment,
      })
      .pipe(
        map((res: any) => {
          return res.data;
        })
      );
  }

  public async getWorkoutComments(url: any = undefined, workoutAssetId: number, params = {}) {
    const _url = url ? url : `${API_URLS.WORKOUT_RATINGS}/${workoutAssetId}/ratings`;
    const $observer = this._http
      .get(`${this.BASE_URL}${_url}`, {
        params: new HttpParams({ fromObject: params }),
      })
      .pipe(
        map((res: any) => {
          const data = res.data.ratings.map((item: any) => new RatingModel(item));
          return {
            paginator: new PaginatorModel(res.data),
            data,
          };
        })
      );
    return await firstValueFrom($observer);
  }

  public deleteWorkout(workoutId: number) {
    return this._http.delete(`${this.BASE_URL}${API_URLS.WORKOUT}/${workoutId}`);
  }

  public saveFavorite(userId: number, workoutId: number) {
    return this._http.post(
      `${this.BASE_URL}${API_URLS.WORKOUT_FAVORITES}/${workoutId}/user/${userId}/save`,
      {}
    );
  }

  public removeFavorite(userId: number, workoutId: number) {
    return this._http.delete(
      `${this.BASE_URL}${API_URLS.WORKOUT_FAVORITES}/${workoutId}/user/${userId}`
    );
  }

  public getOnlyidsFavoritesByUser(userId: number) {
    return this._http.get(`${this.BASE_URL}${API_URLS.WORKOUT_FAVORITES}/user/ids/${userId}`).pipe(
      tap((res: any) => {
        this._localStarageService.set(KEY_LOCALSTORAGE.FAVORITES, res.data);
      })
    );
  }

  public getFavoritesByUser(url: any = undefined, userId: number, params = {}) {
    const _url = url ? url : `${API_URLS.WORKOUT_FAVORITES}/user/${userId}`;
    return this._http
      .get(`${this.BASE_URL}${_url}`, {
        params: new HttpParams({ fromObject: params }),
      })
      .pipe(
        map((res: any) => {
          const data = res.data.favorites.map((item: any) => ({
            ...item,
            workout: new WorkoutListModel(item.workout),
          })) as Favorite[];
          return {
            paginator: new PaginatorModel(res.data),
            data,
          };
        })
      );
  }

  public async saveChangeFavoriteStatus(isFav: boolean, workoutId: number) {
    const userId = this.sesionService.user$()?.userId ?? 0;
    const method = isFav ? 'saveFavorite' : 'removeFavorite';
    this._loaderUIService.showLoader();
    try {
      const resp = await firstValueFrom(this[method](userId, workoutId));
      const message = isFav
        ? 'workout.messages.favorite-added'
        : 'workout.messages.favorite-removed';
      if (isFav) {
        this._toastService.success(this._translateService.instant(message));
        const favorites = (await this._localStarageService.get(KEY_LOCALSTORAGE.FAVORITES)) || [];
        favorites.push(workoutId);
        await this._localStarageService.set(KEY_LOCALSTORAGE.FAVORITES, [...new Set(favorites)]);
      } else {
        this._toastService.success(this._translateService.instant(message));
        const favorites = (await this._localStarageService.get(KEY_LOCALSTORAGE.FAVORITES)) || [];
        const newFavorites = favorites.filter((id: number) => id !== workoutId);
        await this._localStarageService.set(KEY_LOCALSTORAGE.FAVORITES, [...new Set(newFavorites)]);
      }
    } catch (error) {
      const message = isFav
        ? 'workout.messages.favorite-not-added'
        : 'workout.messages.favorite-not-removed';
      this._toastService.error(this._translateService.instant(message));
      throw error;
    } finally {
      this._loaderUIService.hideLoader();
    }
  }

  async removeFavoriteModal(workout: WorkoutListModel) {
    const modal = await this.modalCtrl.create({
      component: RemoveFavoriteModalComponent,
      componentProps: {
        workout: workout,
      },
      mode: 'md',
      cssClass: 'bottom-sheet-modal-rounded',
      breakpoints: [0, 0.5, 0.75],
      initialBreakpoint: 0.6,
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    try {
      if (role === MODAL_RESPONSE.CONFIRM) {
        await this.saveChangeFavoriteStatus(false, workout.workoutId);
      } else {
        throw new Error('Cancelado por el usuario');
      }
    } catch (error) {
      throw new Error('Error removing favorite');
    }
  }

  async changeStatusLikeWorkout(isLiked: boolean, workoutId: number) {
    this._loaderUIService.showLoader();
    try {
      const resp = await firstValueFrom(
        this._http.post(`${this.BASE_URL}${API_URLS.WORKOUT_LIKES}/${workoutId}/like`, {})
      );
      const message = isLiked ? 'workout.messages.like-added' : 'workout.messages.like-removed';
      if (isLiked) {
        this._toastService.success(this._translateService.instant(message));
        const likes = (await this._localStarageService.get(KEY_LOCALSTORAGE.LIKES_WORKOUT)) || [];
        console.log(likes);
        likes.push(workoutId);
        await this._localStarageService.set(KEY_LOCALSTORAGE.LIKES_WORKOUT, [...new Set(likes)]);
      } else {
        this._toastService.success(this._translateService.instant(message));
        const likes = (await this._localStarageService.get(KEY_LOCALSTORAGE.LIKES_WORKOUT)) || [];
        const newLikes = likes.filter((id: number) => id !== workoutId);
        await this._localStarageService.set(KEY_LOCALSTORAGE.LIKES_WORKOUT, [...new Set(newLikes)]);
      }
    } catch (error) {
      const message = isLiked
        ? 'workout.messages.like-not-added'
        : 'workout.messages.like-not-removed';
      this._toastService.error(this._translateService.instant(message));
      console.log(error);
      throw error;
    } finally {
      this._loaderUIService.hideLoader();
    }
  }

  public getLikesWorkoutsByUserOnlyIds(userId: number) {
    return this._http.get(`${this.BASE_URL}${API_URLS.WORKOUT_LIKES}/by-user/${userId}`).pipe(
      tap((res: any) => {
        this._localStarageService.set(KEY_LOCALSTORAGE.LIKES_WORKOUT, res.data);
      })
    );
  }

  async checkLike(workoutId: number) {
    const likes = await this._localStarageService.get(KEY_LOCALSTORAGE.LIKES_WORKOUT);
    const isLiked = likes?.includes(workoutId);
    if (isLiked) {
      return true;
    }
    const user = await this._localStarageService.get(KEY_LOCALSTORAGE.USER);
    if (!user) return false;
    const resp = await firstValueFrom(this.getLikesWorkoutsByUserOnlyIds(user.userId));
    try {
      const updatedFavorites = resp.data;
      return updatedFavorites?.includes(workoutId);
    } catch {
      return false;
    }
  }

  public getRatingByWorkoutAssetandUser(workoutAssetId: number, userId: number) {
    return this._http
      .get(`${this.BASE_URL}${API_URLS.WORKOUT_RATINGS}/${workoutAssetId}/${userId}/rating-by-user`)
      .pipe(
        map((res: any) => {
          return res ? new RatingModel(res.data) : null;
        })
      );
  }
}

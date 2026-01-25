import { Injectable } from '@angular/core';
import { firstValueFrom, tap } from 'rxjs';
import { environment } from '../../shared/environment/environment';
import { SesionService } from './sesion.service';
import { ToastService } from '../../shared/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { ModalController } from '@ionic/angular/standalone';
import { LocalStorageService } from './local-storage.service';
import { LoaderUIService } from './loader-ui.service';
import { KEY_LOCALSTORAGE } from '../../shared/constants/key-localstorage';
import { API_URLS } from '../../shared/constants/api-urls';
import { HttpClient } from '@angular/common/http';
import { WorkoutListModel } from '../../shared/models/workout-response-list';
import { RemoveFavoriteModalComponent } from '../../ui/src/lib/components/remove-favorite-modal.component/remove-favorite-modal.component';
import { MODAL_RESPONSE } from '../../shared/constants/enums';
import { WorkoutService } from '../../shared/services/workout/workout.service';

@Injectable({
  providedIn: 'root',
})
export class ActionsWorkoutService {
  private readonly BASE_URL = environment.API_URL;
  constructor(
    private _http: HttpClient,
    private sesionService: SesionService,
    private _toastService: ToastService,
    private _translateService: TranslateService,
    private modalCtrl: ModalController,
    private _localStarageService: LocalStorageService,
    private _loaderUIService: LoaderUIService,
    private _workoutservice: WorkoutService
  ) {}

  public getOnlyidsFavoritesByUser(userId: number) {
    return this._http.get(`${this.BASE_URL}${API_URLS.WORKOUT_FAVORITES}/user/ids/${userId}`).pipe(
      tap((res: any) => {
        this._localStarageService.set(KEY_LOCALSTORAGE.FAVORITES, res.data);
      })
    );
  }

  public async saveChangeFavoriteStatus(isFav: boolean, workoutId: number) {
    const userId = this.sesionService.user$()?.userId ?? 0;
    const method = isFav ? 'saveFavorite' : 'removeFavorite';
    this._loaderUIService.showLoader();
    try {
      const resp = await firstValueFrom(this._workoutservice[method](userId, workoutId));
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
}

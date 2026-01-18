import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { API_URLS } from '../../constants/api-urls';
import { firstValueFrom, map, tap } from 'rxjs';
import { WorkoutListModel } from '../../models/workout-response-list';
import { PaginatorModel } from 'libs/shared/models/paginator';
import { RatingModel } from '../../models/rating.model';
import { Favorite } from 'libs/shared/models/workout-favorites';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  private readonly BASE_URL = environment.API_URL;
  constructor(private _http: HttpClient) {}

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
    return this._http.get(`${this.BASE_URL}${API_URLS.WORKOUT_FAVORITES}/user/ids/${userId}`);
  }

  public getFavoritesByUser(userId: number, params = {}) {
    return this._http
      .get(`${this.BASE_URL}${API_URLS.WORKOUT_FAVORITES}/user/${userId}`, {
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
}

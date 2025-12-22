import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { API_URLS } from '../../constants/api-urls';
import { firstValueFrom, map } from 'rxjs';
import { WorkoutListModel } from '../../models/workout-response-list';
import { PaginatorModel } from 'libs/shared/models/paginator';

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
          const data = res.data.workouts.map(
            (item: any) => new WorkoutListModel(item)
          );
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
    const $observer = this._http
      .get(`${this.BASE_URL}${API_URLS.WORKOUT}/${id}`)
      .pipe(
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

  public async getWorkoutComments(url = null, workoutId: number, params = {}) {
    const _url = url ? url : `${API_URLS.WORKOUT}/${workoutId}/comments`;
    const $observer = this._http
      .get(`${this.BASE_URL}${url}`, {
        params: new HttpParams({ fromObject: params }),
      })
      .pipe(
        map((res: any) => {
          const data = res.data.workouts.map(
            (item: any) => new WorkoutListModel(item)
          );
          return {
            paginator: new PaginatorModel(res.data),
            data: data,
          };
        })
      );
    return await firstValueFrom($observer);
  }
}

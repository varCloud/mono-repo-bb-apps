import { HttpClient } from '@angular/common/http';
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

  public async getWorkouts(url = API_URLS.WORKOUT) {
    const $observer = this._http.get(`${this.BASE_URL}${url}`).pipe(
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

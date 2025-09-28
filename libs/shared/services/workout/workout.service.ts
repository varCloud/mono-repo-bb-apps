import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { API_URLS } from '../../constants/api-urls';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  private readonly BASE_URL = environment.API_URL;
  constructor(private _http: HttpClient) {}

  public createWorkout(payload: any) {
    return this._http.post(`${this.BASE_URL}${API_URLS.WORKOUT}`, payload);
  }
}

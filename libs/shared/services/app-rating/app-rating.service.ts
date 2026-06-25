import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { API_URLS } from '../../constants/api-urls';
import { AppRating, AppRatingModel } from '../../models/app-rating.model';

@Injectable({
  providedIn: 'root',
})
export class AppRatingService {
  private readonly BASE_URL = environment.API_URL;

  constructor(private _http: HttpClient) {}

  upsertRating(appTypeId: number, rating: number, comment: string): Observable<AppRatingModel> {
    return this._http
      .post(`${this.BASE_URL}${API_URLS.APP_RATINGS}`, { appTypeId, rating, comment })
      .pipe(map((res: any) => new AppRatingModel(res.data)));
  }

  getMyRating(appTypeId: number): Observable<AppRatingModel | null> {
    const params = new HttpParams().set('appTypeId', appTypeId);
    return this._http
      .get(`${this.BASE_URL}${API_URLS.APP_RATINGS}/my-rating`, { params })
      .pipe(map((res: any) => (res.data ? new AppRatingModel(res.data) : null)));
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, map, Observable, switchMap, tap } from 'rxjs';
import { LocalStorageService } from '@monorepo-bb-app/core';
import { SesionService } from '@monorepo-bb-app/core';
import { environment,  CategoryByUserModel,
  SaveCategoriesRequest, API_URLS , KEY_LOCALSTORAGE, PaymentFrecuencyRequest, BillingCycle, User, UserModel, 
  SaveGoalsRequest} from '@monorepo-bb-app/shared';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _baseUrl = `${environment.API_URL}`;
  constructor(
    private _http: HttpClient,
    private _localStorage: LocalStorageService,
    private _sesionService: SesionService,
  ) {}

  public getUser(userId?: number): Observable<User> {
    const id = userId ?? this._sesionService.user$()?.userId;
    return this._http.get<User>(`${this._baseUrl}${API_URLS.USER}/${id}`).pipe(
      map((resp: any) => new UserModel(resp.data)),
      tap((user) => this._sesionService.setUser(user)),
    );
  }

  public saveGoals(goals: SaveGoalsRequest) {
    return this._http.post(
      `${this._baseUrl}${API_URLS.USER_GOALS}`,
      goals,
    );
  }

  public updateUser(userId: number, user: Partial<User>) {
    return this._http.patch(`${this._baseUrl}${API_URLS.USER}/${userId}`, user);
  }
}

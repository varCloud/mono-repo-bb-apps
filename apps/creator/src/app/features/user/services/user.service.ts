import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, map, Observable, switchMap, tap } from 'rxjs';
import { LocalStorageService } from '@monorepo-bb-app/core';
import { SesionService } from '@monorepo-bb-app/core';
import { environment,  CategoryByUserModel,
  SaveCategoriesRequest, API_URLS , KEY_LOCALSTORAGE, PaymentFrecuencyRequest, BillingCycle, User, UserModel } from '@monorepo-bb-app/shared';

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

  public getCategories() {
    return this._http
      .get<CategoryByUserModel[]>(`${this._baseUrl}${API_URLS.USER_CATEGORIES}`)
      .pipe(map((resp) => resp.map((item) => new CategoryByUserModel(item))));
  }

  public getBillingCycles() {
    return from(this._localStorage.get(KEY_LOCALSTORAGE.USER)).pipe(
      switchMap((user) =>
        this._http.get<BillingCycle[]>(
          `${this._baseUrl}${API_URLS.USER_BILLING_CYCLES}/${user.userId}`,
        ),
      ),
    );
  }

  public saveCategories(categories: SaveCategoriesRequest) {
    return this._http.post(
      `${this._baseUrl}${API_URLS.USER_CATEGORIES}`,
      categories,
    );
  }

  public savePaymentFrequency(paymentFrequency: PaymentFrecuencyRequest[]) {
    return this._http.post(`${this._baseUrl}${API_URLS.USER_BILLING_CYCLES}`, {
      cycleBillings: [...paymentFrequency],
    });
  }

  public updateUser(userId: number, user: Partial<User>) {
    return this._http.patch(`${this._baseUrl}${API_URLS.USER}/${userId}`, user);
  }
}

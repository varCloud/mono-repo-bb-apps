import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, map, Observable, switchMap, take, tap } from 'rxjs';

import { environment } from '../../shared/environment/environment';

import { BillingCycle, User, UserModel } from '../../shared/models/user.model';
import { API_URLS } from '../../shared/constants/api-urls';
import {
  CategoryByUserModel,
  SaveCategoriesRequest,
} from '../../shared/models/categories';
import { PaymentFrecuencyRequest } from '../../shared/models/payment-frecuency';
import { KEY_LOCALSTORAGE } from '../../shared/constants/key-localstorage';
import { LocalStorageService } from './local-storage.service';
import { SesionService } from './sesion.service';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _baseUrl = `${environment.API_URL}`;

  constructor(
    private _http: HttpClient,
    private _localStorage: LocalStorageService,
    private _sesionService: SesionService,
    private logger: LoggerService
  ) {}

  public getUser(userId?: number): Observable<User> {
    const id = userId ?? this._sesionService.user$()?.userId;
    return this._http.get<User>(`${this._baseUrl}${API_URLS.USER}/${id}`).pipe(
      map((resp: any) => new UserModel(resp.data)),
      tap((user) => this._sesionService.setUser(user))
    );
  }

  public getCreatorInfo(userId?: number): Observable<User> {
    return this._http
      .get<User>(`${this._baseUrl}${API_URLS.USER}/${userId}`)
      .pipe(map((resp: any) => new UserModel(resp.data)));
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
          `${this._baseUrl}${API_URLS.USER_BILLING_CYCLES}/${user.userId}`
        )
      )
    );
  }

  public saveCategories(categories: SaveCategoriesRequest) {
    return this._http.post(
      `${this._baseUrl}${API_URLS.USER_CATEGORIES}`,
      categories
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

  public statusAccountPaymentStripe(userId: number) {
    return this._http
      .get(
        `${this._baseUrl}${API_URLS.USER}/${userId}/account-register-payment-status`
      )
      .pipe(map((resp: any) => resp.data.data.accountValidation));
  }

  public async updatePushTokenIfSessionActive(): Promise<void> {
    let user = this._sesionService.user$?.();
    if (!user) {
      user = await this._sesionService.getUserFromLocalStorage();
    }
    if (user && user.userId) {
      const payload = {
        pushNotificationToken:
          (await this._localStorage.get(KEY_LOCALSTORAGE.TOKEN_PUSH)) || '',
      };

      if (payload.pushNotificationToken == '') {
        this.logger.info(
          'No hay token push guardado en local storage, no se actualiza el token push'
        );
        return;
      }

      if (payload.pushNotificationToken == user?.pushNotificationToken) {
        this.logger.info(
          'El token push guardado es igual al token actual del usuario, no se actualiza el token push'
        );
        return;
      }

      this.logger.info('Actualizando token push para usuario', {
        userId: user.userId,
        pushNotificationToken: payload.pushNotificationToken,
      });
      this.updateUser(user.userId, payload)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.logger.info(
              'Token push actualizado correctamente para usuario',
              {
                userId: user.userId,
                pushNotificationToken: payload.pushNotificationToken,
              }
            );
          },
          error: (error) => {
            this.logger.error('Error al actualizar token push para usuario', {
              userId: user.userId,
              error,
            });
          },
        });
    } else {
      this.logger.info('No hay sesión activa, no se actualiza el token push');
    }
  }
}

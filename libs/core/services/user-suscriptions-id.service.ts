import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@monorepo-bb-app/shared';
import { map, Observable, catchError, throwError } from 'rxjs';
import {ApiResponse, Subscription} from '@monorepo-bb-app/shared';


@Injectable({
  providedIn: 'root',
})
export class UserSuscriptionsIdService {

  private baseUrl = 'https://bb-api-y0vm.onrender.com/api/v1/user';
  readonly BASE_URL = environment.API_URL;
  constructor(private httpClient: HttpClient) {}

/**
   * Obtiene las suscripciones para un usuario y suscripción específicos.
   * @param userId El ID del usuario (ej. 88)
   * @param subscriptionId El ID de la suscripción (ej. 1)
   */



  public getSubscriptions(userId: number, subscriptionId: number): Observable<Subscription[]> {
    const url = `${this.baseUrl}/${userId}/suscriptions/${subscriptionId}`;
    return this.httpClient.get<ApiResponse>(url).pipe(

      // 4. Usamos el operador 'map' de RxJS para transformar la respuesta.
      // El componente no quiere el objeto {"data": [...]}, solo quiere el array [...].
      map(response => response.data),

      // 5. Usamos 'catchError' de RxJS para manejar cualquier error de la petición
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error desconocido.';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Error Código: ${error.status}\nMensaje: ${error.message}`;
    }
    console.error(errorMessage);
    // Retornamos un observable que emite un error
    return throwError(() => new Error(errorMessage));
  }
}


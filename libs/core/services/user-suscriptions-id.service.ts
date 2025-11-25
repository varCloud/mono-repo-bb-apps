import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment, PaginatorModel, SubscriptionModel } from '@monorepo-bb-app/shared';
import { map, Observable, catchError, throwError } from 'rxjs';
import {ApiResponse, Subscription} from '@monorepo-bb-app/shared';

@Injectable({
  providedIn: 'root',
})
export class UserSuscriptionsIdService {

  readonly BASE_URL = environment.API_URL;
  constructor(private httpClient: HttpClient) {}

  public getSubscriptions(uri: string= "",  params: any = {}): Observable<{subscription : Subscription[], paginator: PaginatorModel}> {
    const url = `${this.BASE_URL}${uri}`;
    return this.httpClient.get<ApiResponse>(url, { params: new HttpParams({ fromObject: params }) }).pipe(
      map((response:any ) =>{
        return {subscription: response.data.subscriptions.map((item:any) => new  SubscriptionModel(item)) , paginator: new PaginatorModel(response.data)};
      } ),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error desconocido.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Código: ${error.status}\nMensaje: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}


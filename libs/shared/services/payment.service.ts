import { PaymentTotalsModel } from './../models/paymen-totals.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { PaymentTransactionModel, PaymentResponse, PaymentFilters } from '../models/payment-transaction';
import { PaginatorModel } from '../models/paginator';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private readonly BASE_URL = `${environment.API_URL}/user-payments`;

  constructor(private httpClient: HttpClient) {}

  /**
   * Obtiene los pagos realizados por un atleta
   */
  public getAthleteCharges(
    athleteId: number, 
    filters: PaymentFilters = {}
  ): Observable<{payments: PaymentTransactionModel[], paginator: PaginatorModel}> {
    const url = `${this.BASE_URL}/athlete/${athleteId}/charges`;
    const params = this.buildParams(filters);
    
    return this.httpClient.get<PaymentResponse>(url, { params }).pipe(
      map((response) => ({
        payments: response.data.items.map(item => new PaymentTransactionModel(item)),
        paginator: new PaginatorModel({ meta: response.data.meta, links: response.data.links })
      })),
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene las ganancias de un creador
   */
  public getCreatorEarnings(
    creatorId: number, 
    filters: PaymentFilters = {}
  ): Observable<{payments: PaymentTransactionModel[], paginator: PaginatorModel}> {
    const url = `${this.BASE_URL}/creator/${creatorId}/earnings`;
    const params = this.buildParams(filters);
    
    return this.httpClient.get<PaymentResponse>(url, { params }).pipe(
      map((response) => ({
        payments: response.data.items.map(item => new PaymentTransactionModel(item)),
        paginator: new PaginatorModel({ meta: response.data.meta, links: response.data.links })
      })),
      catchError(this.handleError)
    );
  }

    public getCreatorTotalEarnings(creatorId: number): Observable<PaymentTotalsModel> {
    const url = `${this.BASE_URL}/creator/${creatorId}/total-earnings`;    
    return this.httpClient.get<any>(url).pipe(
      map((response) => new PaymentTotalsModel(response.data)),
    )
  }


  private buildParams(filters: PaymentFilters): HttpParams {
    let params = new HttpParams();
    
    if (filters.page) {
      params = params.set('page', filters.page.toString());
    }
    if (filters.limit) {
      params = params.set('limit', filters.limit.toString());
    }
    if (filters.search) {
      params = params.set('search', filters.search);
    }
    if (filters.startDate) {
      params = params.set('startDate', filters.startDate);
    }
    if (filters.endDate) {
      params = params.set('endDate', filters.endDate);
    }
    if (filters.sortBy) {
      params = params.set('sortBy', filters.sortBy);
    }
    if (filters.sortOrder) {
      params = params.set('sortOrder', filters.sortOrder);
    }
    
    return params;
  }

  private handleError = (error: any): Observable<{payments: PaymentTransactionModel[], paginator: PaginatorModel}> => {
    console.error('Error en PaymentService:', error);
    return of({ payments: [], paginator: new PaginatorModel({ meta: { totalItems: 0, itemCount: 0, itemsPerPage: 10, totalPages: 0, currentPage: 1 }, links: { first: '', previous: null, next: null, last: '' } }) });
  };
}
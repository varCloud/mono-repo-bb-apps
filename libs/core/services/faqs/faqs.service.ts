import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment, FaqModel, RequestFaqs } from '@monorepo-bb-app/shared';
import { Faq } from '@monorepo-bb-app/shared';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FaqService {
  readonly BASE_URL = environment.API_URL;
  constructor(private httpClient: HttpClient) {}
  public getFaqs(params: RequestFaqs):Observable<Faq[]> {
    return this.httpClient
      .get(`${this.BASE_URL}/faqs`, { params: { ...params } }) //destructuracion
      .pipe(
        map((respuesta: any) => {
          let faqs: Faq[] = [];
          faqs = respuesta.data.map((item: any) => {
            return new FaqModel(item);
          });
          return faqs;
        })
      );
  }
}

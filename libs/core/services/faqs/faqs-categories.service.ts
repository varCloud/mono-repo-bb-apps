import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment, FaqCategoriesModel } from '@monorepo-bb-app/shared';
import { FaqCategories } from '@monorepo-bb-app/shared';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FaqCategoriesService {
  readonly BASE_URL = environment.API_URL;
  constructor(private httpClient: HttpClient) {}
  public getFaqsCategories():Observable<FaqCategories[]> {
    return this.httpClient
      .get(`${this.BASE_URL}/catalogs/faq-categories`) //destructuracion
      .pipe(
        map((respuesta: any) => {
          let faqsCategories: FaqCategories[] = [];
          faqsCategories = respuesta.data.map((item: any) => {
            return new FaqCategoriesModel(item);
          });
          return faqsCategories;
        })
      );
  }
}

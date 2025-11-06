import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '@monorepo-bb-app/shared';


@Injectable({
  providedIn: 'root',
})
export class FaqService {
readonly BASE_URL = environment.API_URL;
  constructor(private httpClient: HttpClient ) {


  }
  public getFact(userTypeId :number, categoryId :number   ) {
    return this.httpClient.get(`${this.BASE_URL}/faqs`,{ params: { _userTypeId: userTypeId , categoryId: categoryId  } });
  }
}

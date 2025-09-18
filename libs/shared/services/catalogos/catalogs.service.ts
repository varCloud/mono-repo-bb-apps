import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'libs/shared/environment/environment';
import { API_URLS } from 'libs/shared/constants/api-urls';
import { CatalogType } from 'libs/shared/models/catalogs';

@Injectable({
  providedIn: 'root',
})
export class CatalogsService {
  private _baseUrl = environment.API_URL;
  private _catalogsUrl = `${this._baseUrl}${API_URLS.CATALOGS}`;

  constructor(private _http: HttpClient) {}

  public getCatalog<T>(catalogType: CatalogType) {
    return this._http.get<T>(`${this._catalogsUrl}/${catalogType}`);
  }
}

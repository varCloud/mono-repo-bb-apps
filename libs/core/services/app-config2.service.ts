import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment, AppConfig2Model} from '@monorepo-bb-app/shared';
import { map, Observable } from 'rxjs';



@Injectable({
  providedIn: 'root',
})
export class AppConfig2Service {
  readonly BASE_URL = environment.API_URL;
  constructor(private httpClient: HttpClient) {}
  public getAppConfig():Observable<AppConfig2Model[]> {
    return this.httpClient
      .get(`${this.BASE_URL}/app-settings`) //destructuracion
      .pipe(
        map((respuesta: any) => {
          let appSettings: AppConfig2Model[] = [];
          appSettings = respuesta.data.map((item: any) => {
           return  item;
          });
          return appSettings;
        })
      );
  }
}

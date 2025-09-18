import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { PreloadAllModules, provideRouter, RouteReuseStrategy, withPreloading } from '@angular/router';
import { appRoutes } from './app.routes';
import { IonicRouteStrategy } from '@ionic/angular/standalone';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { HttpClient, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicStorageModule } from '@ionic/storage-angular';
import { BlockUIModule } from 'ng-block-ui';
import { register } from 'swiper/element/bundle';
import { httpInterceptor } from '@monorepo-bb-app/core';


register();
export function createTranslateLoader(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}


export const appConfig: ApplicationConfig = {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(appRoutes, withPreloading(PreloadAllModules)),
    provideHttpClient(withFetch(), withInterceptors([httpInterceptor])),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'es',
        useDefaultLang: true,
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
        }
      })
    ),
    importProvidersFrom(IonicStorageModule.forRoot()),
    importProvidersFrom(BlockUIModule.forRoot()),
  ],
};

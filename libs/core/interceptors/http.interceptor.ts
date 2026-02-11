import { HttpInterceptorFn } from '@angular/common/http';

import { inject } from '@angular/core';

import { catchError, from, switchMap, throwError, tap } from 'rxjs';
import { LoggerService } from '../services/logger.service';
import { KEY_LOCALSTORAGE } from '../../shared';
import { LocalStorageService } from '../services/local-storage.service';
import { NavController } from '@ionic/angular';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const storageService = inject(LocalStorageService);
  const router = inject(NavController);
  const logger = inject(LoggerService);
  const urlIgnored = ['auth/login', '/create-account/otp'];
  if (urlIgnored.some((url) => req.url.includes(url))) {
    return next(req);
  }

  return from(storageService.get(KEY_LOCALSTORAGE.TOKEN)).pipe(
    switchMap((token) => {
      if (!token) {
        return next(req);
      }

      const modifiedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      logger.network(`${modifiedReq.method} - ${modifiedReq.url}`, {
        headers: modifiedReq.headers,
        body: modifiedReq.body,
      });

      return next(modifiedReq).pipe(
        tap((response) => {
          logger.network(`Response: ${modifiedReq.method} - ${modifiedReq.url}`, response);
        })
      );
    }),
    catchError((error) => {
      if (error?.error?.statusCode === 401) {
        logger.error('Authentication Error - Unauthorized', error);
        storageService.clear();
        router.navigateRoot(['/login'], { replaceUrl: true });
      } else {
        logger.error(`HTTP Error: ${error?.status} - ${error?.statusText}`, error);
      }
      return throwError(() => error);
    })
  );
};

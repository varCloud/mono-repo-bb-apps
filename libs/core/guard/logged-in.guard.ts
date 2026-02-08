import { CanActivateFn, Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';
import { inject } from '@angular/core';
import { KEY_LOCALSTORAGE } from '../../shared/';

export const loggedInGuard: CanActivateFn = async (route, state) => {
  const storageService = inject(LocalStorageService);
  const router = inject(Router);
  const token = await storageService.get(KEY_LOCALSTORAGE.TOKEN);
  if (token) {
    router.navigate(['/home']);
    return false;
  }
  return true;
};

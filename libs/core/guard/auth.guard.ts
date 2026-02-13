import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';
import { KEY_LOCALSTORAGE } from '../../shared/';
import { NavController } from '@ionic/angular';
export const authGuard: CanActivateFn = async (route, state) => {
  const storageService = inject(LocalStorageService);
  const router = inject(NavController);
  const isProfileIncomplete = route.data?.['isProfileIncomplete'] || false;
  const token = await storageService.get(KEY_LOCALSTORAGE.TOKEN);
  const hasNullProfileFields = await storageService.get(KEY_LOCALSTORAGE.HAS_NULL_PROFILE_FIELDS);

  if (!token) {
    router.navigateRoot(['/login'], { replaceUrl: true });
    return false;
  }
  if (hasNullProfileFields && !isProfileIncomplete) {
    router.navigateRoot(['/profile-incomplete'], { replaceUrl: true });
    return false;
  }

  return true;
};

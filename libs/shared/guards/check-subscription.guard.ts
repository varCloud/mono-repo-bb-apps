import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { SubscriptionStatus } from '../models/subscription-response';
import { UserService } from '../../core/services/user.service';
import { LoaderUIService } from '../../core/services/loader-ui.service';
import { SesionService } from '../../core/services/sesion.service';
import { AppSettingsService } from '../../core/services/app-settings.service';

export const checkSubscriptionGuard: CanActivateFn = async (route) => {
  const router = inject(Router);
  const _user = inject(UserService);
  const _loader = inject(LoaderUIService);
  const _sesion = inject(SesionService);
  const _appSettings = inject(AppSettingsService);
  const userID = route.paramMap.get('userId') ?? 0;
  const creatorID = route.paramMap.get('creatorId') ?? 0;
  const workoutId = route.paramMap.get('workoutId') ?? 0;
  const URL_TO_SUBSCRIPTION = `/home/suscriptions/profile-creator/`;

  const currentEmail = _sesion.user$()?.email;
  const bypassEmails = (_appSettings.settings$()?.subscriptionBypassEmails ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter((email) => !!email);
  if (currentEmail && bypassEmails.includes(currentEmail.toLowerCase())) {
    return true;
  }

  try {
    _loader.showLoader();
    const resp = await _user
      .getSubscriptionInformation(+userID, +creatorID)
      .toPromise();
    const thereSuscription =
      resp.paymentSubscriptionStatus.status === SubscriptionStatus.ACTIVE;
    
    if(resp.paymentSubscriptionStatus.status !== SubscriptionStatus.ACTIVE){
      return router.navigate([URL_TO_SUBSCRIPTION, creatorID],  { queryParams: { workoutId , userID } });
    }

    if (thereSuscription) {
      return true;
    }
  } catch (error) {
    return router.navigate([URL_TO_SUBSCRIPTION, creatorID],  { queryParams: { workoutId , userID } });
  } finally {
    _loader.hideLoader();
  }

  return false;
};

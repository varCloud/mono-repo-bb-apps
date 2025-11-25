import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { SubscriptionStatus } from '../models/subscription-response';
import { UserService } from '../../core/services/user.service';
import { LoaderUIService } from '../../core/services/loader-ui.service';

export const checkSubscriptionGuard: CanActivateFn = async (route) => {
  const router = inject(Router);
  const _user = inject(UserService);
  const _loader = inject(LoaderUIService);

  const userID = route.paramMap.get('userId') ?? 0;
  const creatorID = route.paramMap.get('creatorId') ?? 0;

  try {
    _loader.showLoader();
    const resp = await _user
      .getSubscriptionInformation(+userID, +creatorID)
      .toPromise();
    const thereSuscription =
      resp.paymentSubscriptionStatus.status === SubscriptionStatus.ACTIVE;
    if (thereSuscription) {
      return true;
    }
  } catch (error) {
    return router.navigate(['/home/suscriptions/profile-creator/', creatorID]);
  } finally {
    _loader.hideLoader();
  }

  return false;
};

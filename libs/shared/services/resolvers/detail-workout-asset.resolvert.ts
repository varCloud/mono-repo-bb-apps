import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { catchError, finalize, Observable, of } from 'rxjs';
import { WorkoutService } from '../workout/workout.service';
import { ToastService } from '../toast.service';
import { LoaderUIService } from '../../../core/services/loader-ui.service';

@Injectable({ providedIn: 'root' })
export class WorkoutAssetDataResolver implements Resolve<any> {
  constructor(
    private workoutService: WorkoutService,
    private _loader: LoaderUIService,
    private _toastService: ToastService,
    private _router: Router
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    this._loader.showLoader();
    const id = route.paramMap.get('workoutAssetId') ?? 0;
    if (!id) {
      this._toastService.error('No se encontró el entrenamiento', {
        duration: 1000,
      });
      this._router.navigate(['/home/training']);
      return of(null);
    }
    return this.workoutService.getWorkoutBySubs(+id).pipe(
      finalize(() => this._loader.hideLoader()),
      catchError(() => {
        this.error();
        return of(null);
      })
    );
  }

  private error() {
    this._toastService.error('No se encontró el entrenamiento', {
      duration: 1000,
    });
    this._router.navigate(['/home/training']);
  }
}

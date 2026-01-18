import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, finalize, Observable, of } from 'rxjs';
import { WorkoutService } from '../workout/workout.service';
import { ToastService } from '../toast.service';
import { LoaderUIService } from '../../../core/services/loader-ui.service';
import { SesionService } from '../../../core/services/sesion.service';

@Injectable({ providedIn: 'root' })
export class FavoritesDataResolver implements Resolve<any> {
  constructor(
    private workoutService: WorkoutService,
    private _loader: LoaderUIService,
    private _toastService: ToastService,
    private _router: Router,
    private _sesionService: SesionService
  ) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this._loader.showLoader();
    const user = this._sesionService.user$();
    if (!user) {
      this.error();
      return of(null);
    }
    return this.workoutService.getFavoritesByUser(user.userId).pipe(
      finalize(() => this._loader.hideLoader()),
      catchError(() => {
        this.error();
        return of(null);
      })
    );
  }

  private error() {
    this._toastService.error('Error al obtener favoritos', {
      duration: 1000,
    });
    this._router.navigate(['/home/training']);
  }
}

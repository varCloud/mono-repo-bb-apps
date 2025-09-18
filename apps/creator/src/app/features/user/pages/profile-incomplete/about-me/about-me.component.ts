import { Component, effect, model, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent,
  IonButton,
  IonGrid,
  IonCol,
  IonRow,
  IonTextarea,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HeaderComponent, LayoutContentComponent } from '@monorepo-bb-app/ui';
import { ProfileIncompleteService } from '../../../services/profile-incomplete.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '@monorepo-bb-app/shared';
import { UserService } from '../../../services/user.service';
import { finalize } from 'rxjs';
import { SesionService } from '@monorepo-bb-app/core';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss'],
  imports: [
    IonTextarea,
    IonRow,
    IonCol,
    IonGrid,
    IonButton,
    IonContent,
    LayoutContentComponent,
    HeaderComponent,
    TranslateModule,
    ReactiveFormsModule,
  ],
})
export class AboutMeComponent implements OnInit {
  bio = new FormControl('', [Validators.required, Validators.minLength(10)]);
  isLoading = signal(false);
  constructor(
    private router: Router,
    private profileIncompleteService: ProfileIncompleteService,
    private _toast: ToastService,
    private _userService: UserService,
    private _translate: TranslateService,
    public _sesionService: SesionService,
  ) {
    effect(() => {
      this.bio.setValue(this._sesionService.user$()?.bio || '');
    });
  }

  ngOnInit() {}

  async goToNextStep() {
    if (this.bio.invalid) {
      return;
    }
    const bio = this.bio.value ?? '';
    this.isLoading.set(true);
    this._userService
      .updateUser(this._sesionService.user$()?.userId || 0, {
        bio,
      })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this._toast.success(
            this._translate.instant('about-me.save-success'),
            {
              duration: 1000,
            },
          );
          this.router.navigate(['/profile-incomplete/complete-profile']);
        },
        error: (err) => {
          this._toast.error(this._translate.instant('about-me.save-error'), {
            duration: 1000,
          });
        },
      });
  }
}

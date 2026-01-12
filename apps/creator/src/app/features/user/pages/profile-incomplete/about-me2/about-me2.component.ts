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
import { FormControl, ReactiveFormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ToastService } from '@monorepo-bb-app/shared';
import { UserService } from '../../../services/user.service';
import { finalize } from 'rxjs';
import { LoaderUIService, SesionService } from '@monorepo-bb-app/core';
import { AboutMeComponent } from '@monorepo-bb-app/ui';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me2.component.html',
  styleUrls: ['./about-me2.component.scss'],
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
    AboutMeComponent
  ],
})
export class AboutMeComponent2 implements OnInit {
  bio! : FormGroup
  //= new FormControl('', [Validators.required, Validators.minLength(10)]);
  isLoading = signal(false);
  constructor(
    private router: Router,
    private profileIncompleteService: ProfileIncompleteService,
    private _toast: ToastService,
    private _userService: UserService,
    private _translate: TranslateService,
    public _sesionService: SesionService,
    private fb: FormBuilder,
     private readonly _loaderUIService: LoaderUIService
  ) {
    // effect(() => {
    //   this.bio.setValue(this._sesionService.user$()?.bio || '');
    // });
  }

  ngOnInit() {
    this.createForm();
    this.loadFormData();
  }

  private createForm() {
    this.bio = this.fb.group({
      bio: ['', Validators.required],
    });
  }
  isFormsValid(): boolean {
    return this.bio.valid;
  }

private loadFormData() {
    if (this.bio) {
      this.bio.patchValue({
        bio: this._sesionService.user$()?.bio || '',
      });
    }
  }

  async goToNextStep() {
    if (this.bio.invalid) {
      return;
    }
    const bio = this.bio.get('bio')?.value ?? '';
    this._loaderUIService.showLoader();
    this.isLoading.set(true);
    this._userService
      .updateUser(this._sesionService.user$()?.userId || 0, {
        bio,
      })
      .pipe(finalize(() => {
        this.isLoading.set(false);
        this._loaderUIService.hideLoader();
      }))
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

import { CommonModule } from '@angular/common';
import { Component, effect, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonCol,
  IonRow,
  IonButton,
  IonGrid,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  ErrorMessageComponent,
  HeaderComponent,
  LayoutContentComponent,
  RadioListSelectorComponent,
  SelectOption
} from '@monorepo-bb-app/ui';
import { CatalogsService, CatalogType, ToastService } from '@monorepo-bb-app/shared';
import { LoaderUIService, SesionService } from '@monorepo-bb-app/core';
import { UserService } from '../../../services/user.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-select-level',
  templateUrl: './select-level.component.html',
  styleUrls: ['./select-level.component.scss'],
  standalone: true,
  imports: [
    IonGrid,
    IonButton,
    IonRow,
    IonCol,
    IonContent,
    TranslateModule,
    LayoutContentComponent,
    HeaderComponent,
    RadioListSelectorComponent,
    ReactiveFormsModule,
    ErrorMessageComponent,
    CommonModule,
  ],
})
export class SelectLevelComponent implements OnInit {

  form = this._fb.group({
    activityLevel: ['', Validators.required],
  });
  activityLevelOptions = signal<SelectOption[]>([]);
  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _toast: ToastService,
    private _translate: TranslateService,
    private _loader: LoaderUIService,
    private _catalogsService: CatalogsService,
    private _userService: UserService,
    private _sessionService: SesionService,
  ) {
    effect(() => {
      this._sessionService.user$()
    })
  }
  ngOnInit() {
    this.getActivityLevel();
  }

  onActivityLevelChange(selectedLevel: any): void {
    this.form.patchValue({ activityLevel: selectedLevel });
  }

  private getActivityLevel() {
    this._loader.showLoader();
    this._catalogsService.getCatalog(CatalogType.DIFFICULTY_LEVELS).subscribe({
      next: (levels: any) => {
        this._loader.hideLoader();
        this.activityLevelOptions.set(levels.map(level => ({
          label: level.description,
          value: level.levelId,

        })));
      },
      error: (error) => {
        console.error('Error loading activity levels', error);
        this._loader.hideLoader();
        this._toast.error(
          this._translate.instant('onboarding.select-level.load-error'),
          { duration: 1000 }
        );
      }
    });
  }

  async onContinue() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    try {
      this._loader.showLoader();
      const payload = { levelId: Number(this.form.value.activityLevel) };
      this._userService.updateUser(this._sessionService.user$().userId, payload).pipe(take(1)).subscribe(response => {
        this._loader.hideLoader();
        this._toast.success(this._translate.instant('onboarding.select-level.save-success'));
        this._router.navigate(['/profile-incomplete/profile-setup']);
      });

    } catch (error) {
      console.error('Error saving activity level:', error);
      this._loader.hideLoader();
      this._toast.error(
        this._translate.instant('onboarding.select-level.save-error')
      );
    }
  }
}
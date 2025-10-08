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
  CheckboxListSelectorComponent,
  SelectOption
} from '@monorepo-bb-app/ui';
import { CatalogsService, CatalogType, SaveGoalsRequest, ToastService } from '@monorepo-bb-app/shared';
import { LoaderUIService, SesionService } from '@monorepo-bb-app/core';
import { UserService } from '../../../services/user.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-select-goals',
  templateUrl: './select-goals.component.html',
  styleUrls: ['./select-goals.component.scss'],
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
    CheckboxListSelectorComponent,
    ReactiveFormsModule,
    ErrorMessageComponent,
    CommonModule,
  ],
})
export class SelectGoalsComponent implements OnInit {


  public form = this._fb.group({
    goals: this._fb.control<any[]>([], [Validators.required, Validators.minLength(3)]),
  });
  public goalsOptions = signal<SelectOption[]>([]);
  public maxGoalsSelection = 3;

  get goals() {
    return this.form.get('goals');
  }


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
    this.getGoalsOptions();
  }

  onGoalsChange(selectedGoals: any[]): void {
    this.form.patchValue({ goals: selectedGoals });
  }

  public getGoalsOptions() {
    this._loader.showLoader();
    this._catalogsService.getCatalog(CatalogType.USER_GOALS).subscribe({
      next: (data: any) => {
        this.goalsOptions.set(data.map((goal: any) => ({
          value: goal.goalId,
          label: goal.description,
        })));
      },
      complete: () => {
        this._loader.hideLoader();
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
      const payload: SaveGoalsRequest = {
        userId: this._sessionService.user$()?.userId,
        goalIds: this.form.value.goals,
      }
      this._userService.saveGoals(payload).pipe(take(1)).subscribe((response) => {
        this._loader.hideLoader();
        this._toast.success(this._translate.instant('onboarding.select-goals.save-success'));
        this._router.navigate(['/profile-incomplete/select-level']);

      });

    } catch (error) {
      console.error('Error saving goals:', error);
      this._loader.hideLoader();
      this._toast.error(this._translate.instant('onboarding.select-goals.save-error'),{ duration: 1000 }
      );
    }
  }
}
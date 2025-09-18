import { Component, OnInit, signal } from '@angular/core';
import {
  IonContent,
  IonRow,
  IonCol,
  IonGrid,
  IonButton,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CategoriesSelectComponent, HeaderComponent, LayoutContentComponent } from '@monorepo-bb-app/ui';
import { Categorie } from '@monorepo-bb-app/shared';
import { ProfileIncompleteService } from '../../../services/profile-incomplete.service';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { ToastService } from '@monorepo-bb-app/shared';
import { LoaderUIService } from '@monorepo-bb-app/core';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  imports: [
    IonButton,
    IonGrid,
    IonCol,
    IonRow,
    IonContent,
    LayoutContentComponent,
    HeaderComponent,
    TranslateModule,
    CategoriesSelectComponent,
  ],
})
export class CategoriesComponent implements OnInit {
  isLoading = signal<boolean>(true);
  categoriesSelected = signal<number[]>([]);
  limitSelected = 5;
  constructor(
    private _profileIncompleteService: ProfileIncompleteService,
    private _router: Router,
    private _userService: UserService,
    private _toastService: ToastService,
    private _translate: TranslateService,
    private _loadingService: LoaderUIService,
  ) {
    this.isLoading.set(true);
    this._loadingService.showLoader();
    this._userService
      .getCategories()
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
          this._loadingService.hideLoader();
        }),
      )
      .subscribe({
        next: (categories) => {
          const categoriesSelected = categories.map((cat) => cat.categoryId);
          this.categoriesSelected.set(categoriesSelected);
        },
      });
  }

  ngOnInit() {}

  public onSelectedCategories(categories: Categorie[]) {
    this._profileIncompleteService.setCategories(categories);
  }

  public getSelectedCategories(): number {
    return this._profileIncompleteService.getCategories().length;
  }

  public nextStep() {
    if (this.getSelectedCategories() < 1) {
      return;
    }
    this.isLoading.set(true);
    const categories = this._profileIncompleteService
      .getCategories()
      .map((category) => {
        return { id: category.categoryId };
      });
    this._userService
      .saveCategories({ categories })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this._toastService.success(
            this._translate.instant('categories.save-success'),
            {
              duration: 1000,
            },
          );
          this._router.navigate(['/profile-incomplete/payment-frequency']);
        },
        error: () => {
          this._toastService.error(
            this._translate.instant('categories.save-error'),
            {
              duration: 1000,
            },
          );
        },
      });
  }
}

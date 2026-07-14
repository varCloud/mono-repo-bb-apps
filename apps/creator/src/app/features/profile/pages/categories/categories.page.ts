import { Component, OnInit, signal } from '@angular/core';
import { IonContent, IonGrid, IonRow, IonCol, IonButton } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CategoriesSelectComponent, LayoutContentComponent } from '@monorepo-bb-app/ui';
import { Categorie, ToastService } from '@monorepo-bb-app/shared';
import { LoaderUIService, UserService } from '@monorepo-bb-app/core';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-profile-categories',
  standalone: true,
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  imports: [
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    LayoutContentComponent,
    CategoriesSelectComponent,
    TranslateModule,
  ],
})
export class CategoriesPage implements OnInit {
  isLoading = signal<boolean>(true);
  isSaving = signal<boolean>(false);
  categoriesSelected = signal<number[]>([]);
  private selectedCategories: Categorie[] = [];

  constructor(
    private _userService: UserService,
    private _toastService: ToastService,
    private _translate: TranslateService,
    private _loaderService: LoaderUIService,
  ) {}

  ngOnInit() {
    this.isLoading.set(true);
    this._loaderService.showLoader();
    this._userService
      .getCategories()
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
          this._loaderService.hideLoader();
        }),
      )
      .subscribe({
        next: (categories) => {
          this.categoriesSelected.set(categories.map((cat) => cat.categoryId));
        },
      });
  }

  public onSelectedCategories(categories: Categorie[]) {
    this.selectedCategories = categories;
  }

  public saveCategories() {
    if (this.selectedCategories.length < 1) {
      return;
    }
    this.isSaving.set(true);
    this._loaderService.showLoader();
    const categories = this.selectedCategories.map((category) => ({ id: category.categoryId }));
    this._userService
      .saveCategories({ categories })
      .pipe(
        finalize(() => {
          this.isSaving.set(false);
          this._loaderService.hideLoader();
        }),
      )
      .subscribe({
        next: () => {
          this.categoriesSelected.set(this.selectedCategories.map((category) => category.categoryId));
          this._toastService.success(this._translate.instant('categories.save-success'), {
            duration: 1000,
          });
        },
        error: () => {
          this._toastService.error(this._translate.instant('categories.save-error'), {
            duration: 1000,
          });
        },
      });
  }
}

import { Component, input, OnInit, output, signal } from '@angular/core';
import {
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonCheckbox,
  IonText,
} from '@ionic/angular/standalone';
import { CatalogType } from '@monorepo-bb-app/shared';
import { Categorie, CategorieModel } from '@monorepo-bb-app/shared';
import { Router } from '@angular/router';
import { ToastService } from '@monorepo-bb-app/shared';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CatalogsService } from '@monorepo-bb-app/shared';
import { LoaderUIService } from '@monorepo-bb-app/core';

@Component({
  selector: 'app-categories-select',
  templateUrl: './categories-select.component.html',
  styleUrls: ['./categories-select.component.scss'],
  imports: [
    IonCheckbox,
    IonItem,
    IonCol,
    IonGrid,
    IonRow,
    FormsModule,
    IonText,
    TranslateModule,
  ],
  providers: [TranslatePipe],
})
export class CategoriesSelectComponent implements OnInit {
  categories = signal<Categorie[]>([]);
  limitSelected = input<number>(5);
  defaultSelected = input<number[]>([]);
  selectedCategories = output<Categorie[]>();

  constructor(
    private _catalogsService: CatalogsService,
    private _router: Router,
    private _toastService: ToastService,
    private _translate: TranslatePipe,
    private _loaderService: LoaderUIService,
  ) {}

  ngOnInit() {
    this._loaderService.showLoader();
    this._catalogsService.getCatalog(CatalogType.CATEGORIES).subscribe({
      next: (data: any) => {
        this.categories.set(
          data.map(
            (item: any) =>
              new CategorieModel({
                ...item,
                selected: this.defaultSelected().includes(item.categoryId),
              }),
          ),
        );
        if (this.defaultSelected().length > 0) {
          this.selectedCategories.emit(
            this.categories().filter((cat) => cat.selected),
          );
        }
        this._loaderService.hideLoader();
      },
      error: () => {
        this._toastService.error(
          this._translate.transform('error.error-processing'),
        );
        this._loaderService.hideLoader();
      },
    });
  }

  public selectCategory(category: Categorie) {
    const selectedCount = this.categories().filter((cat) => cat.selected);
    if (selectedCount.length > this.limitSelected()) {
      this.categories.update((cats) => {
        return cats.map((cat) => {
          if (cat.categoryId === category.categoryId) {
            cat.selected = false;
          }
          return cat;
        });
      });
      this._toastService.error(
        this._translate.transform('error.max-categories-selected', {
          limit: this.limitSelected,
        }),
        { duration: 3000 },
      );
      return;
    }

    const selected = this.categories().filter((cat) => cat.selected);
    this.selectedCategories.emit(selected);
  }
}

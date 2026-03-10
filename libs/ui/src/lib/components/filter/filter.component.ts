import { Component, Input, input, type OnInit } from '@angular/core';
import {
  IonHeader,
  IonButtons,
  IonTitle,
  IonToolbar,
  IonButton,
  IonContent,
  IonFooter,
  IonBadge,
  ModalController,
  IonText,
  IonGrid,
  IonCol,
  IonRow
} from '@ionic/angular/standalone';
import { CatalogSelectComponent } from '../catalog-select/catalog-select.component';
import { FormBuilder } from '@angular/forms';
import { CatalogType, FilterModel } from '@monorepo-bb-app/shared';
import { TranslateModule } from '@ngx-translate/core';
import { MODAL_RESPONSE } from 'libs/shared/constants/enums';


@Component({
  selector: 'lib-filter',
  imports: [
    IonContent,
    IonFooter,
    IonButton,
    IonBadge,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonHeader,
    CatalogSelectComponent,
    TranslateModule,
    IonText,
    IonGrid,
    IonRow,
    IonCol
  ],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
})
export class FilterComponent implements OnInit {
  @Input() filter: FilterModel = new FilterModel({});
  filterForm = this._fb.group({
    workoutTags: [[]] as any[],
    levels: [[]] as any[],
    categories: [[]] as any[],
  });
  public CATALOG_TYPE = CatalogType;
  constructor(private modalCtrl: ModalController, private _fb: FormBuilder) {}
  ngOnInit(): void {
    const filterData = this.filter;
    if (filterData) {
      this.filterForm.patchValue(filterData);
    }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, MODAL_RESPONSE.CANCEL);
  }

  confirm() {
    const filter = new FilterModel({
      ...this.filterForm.value,
      showWorkoutTags: this.filter.showWorkoutTags,
      showLevels: this.filter.showLevels,
      showCategories: this.filter.showCategories,
    });
    this.modalCtrl.dismiss(
      { queryParams: filter.toQueryParams(), filter },
      MODAL_RESPONSE.CONFIRM
    );
  }

  public resetFilters() {
    this.filterForm.reset({
      workoutTags: [],
      levels: [],
      categories: [],
    });
    this.filter = new FilterModel({
      showWorkoutTags: this.filter.showWorkoutTags,
      showLevels: this.filter.showLevels,
      showCategories: this.filter.showCategories,
    });
  }
}

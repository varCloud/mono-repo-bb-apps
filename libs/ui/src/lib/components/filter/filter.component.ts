import { Component, type OnInit } from '@angular/core';
import {
  IonHeader,
  IonButtons,
  IonTitle,
  IonToolbar,
  IonButton,
  IonContent,
  ModalController,
} from '@ionic/angular/standalone';
import { CatalogSelectComponent } from '../catalog-select/catalog-select.component';
import { FormBuilder } from '@angular/forms';
import { CatalogType } from '@monorepo-bb-app/shared';
import { TranslateModule } from '@ngx-translate/core';
import { MODAL_RESPONSE } from 'libs/shared/constants/enums';

@Component({
  selector: 'lib-filter',
  imports: [
    IonContent,
    IonButton,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonHeader,
    CatalogSelectComponent,
    TranslateModule,
  ],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
})
export class FilterComponent implements OnInit {
  filterForm = this._fb.group({
    target: [[]] as any[],
  });
  public CATALOG_TYPE = CatalogType;
  constructor(private modalCtrl: ModalController, private _fb: FormBuilder) {}
  ngOnInit(): void {}

  cancel() {
    return this.modalCtrl.dismiss(null, MODAL_RESPONSE.CANCEL);
  }

  confirm() {
    this.modalCtrl.dismiss(this.convertToPayload(), MODAL_RESPONSE.CONFIRM);
  }

  convertToPayload() {
    const { target } = this.filterForm.value;
    let payload = {};
    if (target && target.length > 0) {
      payload = {
        ...payload,
        workoutTags: target.map((t: any) => t.tagId),
      };
    }
    return payload;
  }
}

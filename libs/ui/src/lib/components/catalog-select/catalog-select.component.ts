import { Component, input, signal, type OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CatalogsService, CatalogType } from '@monorepo-bb-app/shared';
import {
  NgLabelTemplateDirective,
  NgMultiLabelTemplateDirective,
  NgOptionTemplateDirective,
  NgSelectComponent,
} from '@ng-select/ng-select';

import {
  IonList,
  IonItem,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ErrorMessageComponent } from '../error-message/error-message.component';

@Component({
  selector: 'lib-catalog-select',
  imports: [
    TranslateModule,
    NgMultiLabelTemplateDirective,
    NgSelectComponent,
    CommonModule,
    ErrorMessageComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './catalog-select.component.html',
  styleUrl: './catalog-select.component.scss',
})
export class CatalogSelectComponent implements OnInit {
  typeCatalog = input.required<CatalogType>();
  blindValue = input<string>('id');
  blindLabel = input<string>('name');
  disabled = input<boolean>(false);
  placeholder = input<string>('Select an option');
  value = input<string | number | null>(null);
  multiple = input<boolean>(false);
  control = input.required<FormControl>();

  data = signal<[]>([]);

  constructor(private _catalogService: CatalogsService) {}

  ngOnInit(): void {
    this._getCatalog();
    if (this.disabled()) {
      this.control().disable();
    }
  }

  private _getCatalog() {
    this._catalogService
      .getCatalog(this.typeCatalog())
      .subscribe((data: any) => {
        this.data.set(data);
      });
  }
}

import {
  Component,
  computed,
  effect,
  Input,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { IonItem } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { CountryCodeSelectComponent } from '../country-code-select/country-code-select.component';
import { COUNTRY_CODES, Countrycode } from '@monorepo-bb-app/shared';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-phone',
  templateUrl: './input-phone.component.html',
  styleUrls: ['./input-phone.component.scss'],
  standalone: true,
  imports: [
    IonItem,
    TranslateModule,
    CountryCodeSelectComponent,
    ReactiveFormsModule,
    ErrorMessageComponent,
    CommonModule,
    NgxMaskDirective,
  ],
  providers: [provideNgxMask()],
})
export class InputPhoneComponent implements OnInit {
  @Input() control!: FormControl;

  isoCode = input<string>('+52');
  maskSelected = output<Countrycode>();

  public label = input<string>('create-account-profile.cellphone-number');
  public placeholder = input<string>('');
  public countryCode = signal<Countrycode | undefined>(undefined);

  constructor() {
    effect(() => {
      const country = COUNTRY_CODES.find((c) => c.dialCode === this.isoCode());
      if (country) {
        this.countryCode.set(country);
      }
    });
  }

  ngOnInit() {}

  onCountrySelect(country: Countrycode) {
    if (this.countryCode()!.isoCode === country.isoCode) return;
    this.countryCode.set(country);
  }
}

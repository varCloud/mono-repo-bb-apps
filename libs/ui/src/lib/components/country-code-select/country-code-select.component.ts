import {
  Component,
  computed,
  effect,
  input,
  OnInit,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import {
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonButton,
  IonPopover,
} from '@ionic/angular/standalone';

import { TranslateModule } from '@ngx-translate/core';
import { COUNTRY_CODES, Countrycode } from '@monorepo-bb-app/shared';
import { addIcons } from 'ionicons';
import { chevronDown } from 'ionicons/icons';

@Component({
  selector: 'app-country-code-select',
  templateUrl: './country-code-select.component.html',
  styleUrls: ['./country-code-select.component.scss'],
  imports: [
    IonPopover,
    IonButton,
    IonIcon,
    IonLabel,
    IonItem,
    IonList,
    TranslateModule,
  ],
})
export class CountryCodeSelectComponent implements OnInit {
  @ViewChild('popover') popover!: HTMLIonPopoverElement;

  public selectedCountryCode = input<string>('MX');
  public countrySelect = output<Countrycode>();

  public getCountry = computed(() => {
    const code = this.selectedCountry();
    const country = COUNTRY_CODES.find((item) => item.isoCode === code);
    if (!country) return;
    this.countrySelect.emit(country);
    return country;
  });

  public selectedCountry = signal<string>('MX');
  public countryCodes = COUNTRY_CODES;

  public isOpen = false;

  constructor() {
    addIcons({ chevronDown });
    effect(() => {
      this.selectedCountry.set(this.selectedCountryCode());
    });
  }

  ngOnInit() {}

  public selectCountry(countryCode: string) {
    this.selectedCountry.set(countryCode);
    this.isOpen = false;
  }

  public presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }
}

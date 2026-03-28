import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Browser } from '@capacitor/browser';
import { IonCheckbox } from '@ionic/angular/standalone';
import { environment } from '../../../../../shared/environment/environment';

@Component({
  selector: 'lib-terms-and-conditions',
  imports: [ReactiveFormsModule, IonCheckbox],
  templateUrl: './terms-and-conditions.html',
  styleUrl: './terms-and-conditions.scss',
})
export class TermsAndConditions {
  termsControl = input.required<FormControl<boolean | null>>();
  termsUrl = environment.URL_TERMS_AND_CONDITIONS;
  async openTermsAndConditions(event?: Event): Promise<void> {
    event?.preventDefault();
    event?.stopPropagation();

    await Browser.open({
      url: this.termsUrl,
    });
  }
}

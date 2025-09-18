import { CommonModule } from '@angular/common';
import { Component, input, OnInit, signal } from '@angular/core';
import { LocalStorageService } from '@monorepo-bb-app/core';
import { KEY_LOCALSTORAGE, Currency } from '@monorepo-bb-app/shared';
import { IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss'],
  imports: [IonText, CommonModule],
})
export class CurrencyComponent implements OnInit {
  public amount = input.required<number>();
  public customClass = input<string>('');
  public isUsDollars = signal<boolean>(false);
  public suffix = signal<string>('');

  constructor(private _localStorage: LocalStorageService) {}

  ngOnInit() {
    this.getConfiguration();
  }

  private async getConfiguration() {
    const config = await this._localStorage.get(KEY_LOCALSTORAGE.CONFIG);
    this.suffix.set(config?.currency || Currency.MXN);
    this.isUsDollars.set(config?.currency === Currency.USD);
  }
}

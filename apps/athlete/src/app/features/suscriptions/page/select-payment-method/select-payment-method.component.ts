import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';

@Component({
  selector: 'lib-select-payment-method',
  imports: [],
  templateUrl: './select-payment-method.component.html',
  styleUrl: './select-payment-method.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectPaymentMethodComponent implements OnInit {

  ngOnInit(): void { }

}

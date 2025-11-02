import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';

@Component({
  selector: 'lib-payment-methods-list',
  imports: [],
  templateUrl: './payment-methods-list.component.html',
  styleUrl: './payment-methods-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentMethodsListComponent implements OnInit {

  ngOnInit(): void { }

}

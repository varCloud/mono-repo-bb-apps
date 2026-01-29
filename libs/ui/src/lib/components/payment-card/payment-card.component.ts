import { 
  Component, 
  input, 
  output, 
  computed,
  ChangeDetectionStrategy 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonIcon,
  IonBadge
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  ellipsisVertical,
  downloadOutline, 
  receiptOutline,
  checkmarkCircleOutline,
  timeOutline 
} from 'ionicons/icons';
import { PaymentTransactionModel } from '@monorepo-bb-app/shared';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'lib-payment-card',
  templateUrl: './payment-card.component.html',
  styleUrl: './payment-card.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    IonIcon,
    IonBadge,
    TranslateModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentCardComponent {
  // Inputs
  payment = input.required<PaymentTransactionModel>();
  userType = input.required<'athlete' | 'creator'>();
  showOptions = input<boolean>(false);

  // Outputs
  optionsClick = output<PaymentTransactionModel>();
  downloadInvoice = output<PaymentTransactionModel>();
  downloadReceipt = output<PaymentTransactionModel>();

  // Computed properties
  displayUser = computed(() => {
    const payment = this.payment();
    const userType = this.userType();
    
    // Para atleta, mostrar creador; para creador, mostrar atleta
    return userType === 'athlete' ? payment.creator : payment.athlete;
  });

  statusColor = computed(() => {
    const payment = this.payment();
    if (payment.isCompleted) {
      return 'success';
    }
    return 'warning';
  });

  statusIcon = computed(() => {
    const payment = this.payment();
    if (payment.isCompleted) {
      return 'checkmark-circle-outline';
    }
    return 'time-outline';
  });

  constructor() {
    addIcons({ 
      ellipsisVertical,
      downloadOutline, 
      receiptOutline,
      checkmarkCircleOutline,
      timeOutline 
    });
  }

  onOptionsClick(event: Event) {
    event.stopPropagation();
    this.optionsClick.emit(this.payment());
  }

  onDownloadInvoice(event: Event) {
    event.stopPropagation();
    if (this.payment().invoicePdfUrl) {
      window.open(this.payment().invoicePdfUrl, '_blank');
    }
  }

  onDownloadReceipt(event: Event) {
    event.stopPropagation();
    if (this.payment().receiptUrl) {
      window.open(this.payment().receiptUrl, '_blank');
    }
  }
}
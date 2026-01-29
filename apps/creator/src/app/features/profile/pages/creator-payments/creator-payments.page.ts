import { Component, signal, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonRefresher,
  IonRefresherContent,
  IonButton,
  IonIcon,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonItem,
  IonDatetime,
  IonModal,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent
} from '@ionic/angular/standalone';
import { 
  PaymentCardComponent,
  EmptyElementsComponent,
  HeaderSearchComponent,
  LayoutContentComponent
} from '@monorepo-bb-app/ui';
import { 
  PaymentTransactionModel,
  PaymentFilters,
  PaginatorModel,
  PaymentService
} from '@monorepo-bb-app/shared';
import { 
  LoaderUIService,
  SesionService
} from '@monorepo-bb-app/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { finalize, take, debounceTime } from 'rxjs';
import { addIcons } from 'ionicons';
import { 
  filterOutline, 
  downloadOutline,
  calendarOutline,
  closeOutline,
  trendingUpOutline,
  walletOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-creator-payments',
  templateUrl: './creator-payments.page.html',
  styleUrl: './creator-payments.page.scss',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonRefresher,
    IonRefresherContent,
    IonButton,
    IonIcon,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonItem,
    IonDatetime,
    IonModal,
    IonButtons,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    PaymentCardComponent,
    EmptyElementsComponent,
    HeaderSearchComponent,
    LayoutContentComponent,
    TranslateModule,
    ReactiveFormsModule
  ],
})
export class CreatorPaymentsPage implements OnInit {
  payments = signal<PaymentTransactionModel[]>([]);
  searchControl = new FormControl('');
  isFilterModalOpen = signal<boolean>(false);
  
  // Filter controls
  startDateControl = new FormControl('');
  endDateControl = new FormControl('');
  sortByControl = new FormControl<string>('transactionDate');
  sortOrderControl = new FormControl<'ASC' | 'DESC'>('DESC');
  
  // UI state
  public imgUrl = signal<string>('assets/images/empty/emptyelements.png');
  public textMessage = signal<string>('No tienes ganancias registradas aún.');
  public paginator!: PaginatorModel;

  // Earnings summary
  totalEarnings = signal<number>(0);
  thisMonthEarnings = signal<number>(0);

  constructor(
    private paymentService: PaymentService,
    private loaderUIService: LoaderUIService,
    private sesionService: SesionService
  ) {
    addIcons({ 
      filterOutline, 
      downloadOutline,
      calendarOutline,
      closeOutline,
      trendingUpOutline,
      walletOutline
    });

    // Setup search debounce
    this.searchControl.valueChanges?.pipe(
      debounceTime(300)
    ).subscribe(() => {
      this.resetAndSearch();
    });
  }

  ngOnInit() {
    this.loadPayments();
  }

  ionViewWillEnter() {
    this.payments.set([]);
    this.loadPayments();
  }

  private loadPayments(isLoadMore: boolean = false) {
    const userId = this.sesionService.user$()?.userId;
    if (!userId) {
      console.error('No se encontró el ID del usuario');
      return;
    }

    const filters: PaymentFilters = {
      page: isLoadMore ? (this.paginator?.meta.currentPage || 0) + 1 : 1,
      limit: 25,
      search: this.searchControl.value || undefined,
      startDate: this.startDateControl.value || undefined,
      endDate: this.endDateControl.value || undefined,
      sortBy: this.sortByControl.value || 'transactionDate',
      sortOrder: this.sortOrderControl.value || 'DESC'
    };

    if (!isLoadMore) {
      this.loaderUIService.showLoader();
    }

    this.paymentService.getCreatorEarnings(userId, filters)
      .pipe(
        take(1),
        finalize(() => {
          if (!isLoadMore) {
            this.loaderUIService.hideLoader();
          }
        })
      )
      .subscribe({
        next: (data) => {
          if (isLoadMore) {
            this.payments.set([...this.payments(), ...data.payments]);
          } else {
            this.payments.set(data.payments);
            this.calculateEarnings(data.payments);
          }
          this.paginator = data.paginator;
        },
        error: (error) => {
          console.error('Error loading earnings:', error);
        }
      });
  }

  private calculateEarnings(payments: PaymentTransactionModel[]) {
    const total = payments.reduce((sum, payment) => sum + payment.creatorPayout, 0);
    this.totalEarnings.set(total);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonth = payments
      .filter(payment => {
        const paymentDate = new Date(payment.transactionDate);
        return paymentDate.getMonth() === currentMonth && 
               paymentDate.getFullYear() === currentYear;
      })
      .reduce((sum, payment) => sum + payment.creatorPayout, 0);
    
    this.thisMonthEarnings.set(thisMonth);
  }

  loadMorePayments(event: any) {
    if (this.paginator && this.paginator.meta.currentPage < this.paginator.meta.totalPages) {
      this.loadPayments(true);
    }
    event.target.complete();
  }

  resetAndSearch() {
    this.payments.set([]);
    this.loadPayments();
  }

  onDownloadInvoice(payment: PaymentTransactionModel) {
    if (payment.invoicePdfUrl) {
      window.open(payment.invoicePdfUrl, '_blank');
    }
  }

  onDownloadReceipt(payment: PaymentTransactionModel) {
    if (payment.receiptUrl) {
      window.open(payment.receiptUrl, '_blank');
    }
  }

  onPaymentOptions(payment: PaymentTransactionModel) {
    // Aquí podrías abrir un modal con más opciones
    console.log('Payment options for:', payment);
  }

  openFilterModal() {
    this.isFilterModalOpen.set(true);
  }

  closeFilterModal() {
    this.isFilterModalOpen.set(false);
  }

  applyFilters() {
    this.closeFilterModal();
    this.resetAndSearch();
  }

  clearFilters() {
    this.startDateControl.setValue('');
    this.endDateControl.setValue('');
    this.sortByControl.setValue('transactionDate');
    this.sortOrderControl.setValue('DESC');
    this.resetAndSearch();
  }
}
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
  IonCol, IonGrid, IonRow
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
  closeOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-athlete-payments',
  templateUrl: './athlete-payments.page.html',
  styleUrl: './athlete-payments.page.scss',
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
    PaymentCardComponent,
    EmptyElementsComponent,
    HeaderSearchComponent,
    LayoutContentComponent,
    TranslateModule,
    ReactiveFormsModule,
      IonCol, IonGrid, IonRow
  ],
})
export class AthletePaymentsPage implements OnInit {
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
  public textMessage = signal<string>('No tienes pagos registrados aún.');
  public paginator!: PaginatorModel;

  constructor(
    private paymentService: PaymentService,
    private loaderUIService: LoaderUIService,
    private sesionService: SesionService
  ) {
    addIcons({ 
      filterOutline, 
      downloadOutline,
      calendarOutline,
      closeOutline
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

    this.paymentService.getAthleteCharges(userId, filters)
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
          }
          this.paginator = data.paginator;
        },
        error: (error) => {
          console.error('Error loading payments:', error);
        }
      });
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
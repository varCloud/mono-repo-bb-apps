import { Component, Input, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { star, starOutline } from 'ionicons/icons';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { MODAL_RESPONSE } from 'libs/shared/constants/enums';
import { LoaderUIService } from '@monorepo-bb-app/core';
import { AppRatingModel, AppRatingService, ToastService } from '@monorepo-bb-app/shared';

@Component({
  selector: 'lib-app-rating-modal',
  templateUrl: './app-rating-modal.component.html',
  styleUrls: ['./app-rating-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, TranslateModule],
})
export class AppRatingModalComponent implements OnInit {
  @Input() appTypeId!: number;
  @Input() existingRating: AppRatingModel | null = null;

  reviewForm!: FormGroup;
  stars: number[] = [1, 2, 3, 4, 5];
  hasChanges = signal(true);

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private _loader: LoaderUIService,
    private _appRatingService: AppRatingService,
    private _toastService: ToastService,
    private _translate: TranslateService
  ) {
    addIcons({ star, starOutline });
  }

  ngOnInit(): void {
    this.reviewForm = this.fb.group({
      rating: [
        this.existingRating ? this.existingRating.rating : 0,
        [Validators.required, Validators.min(1)],
      ],
      comment: [this.existingRating ? this.existingRating.comment : ''],
    });

    if (this.existingRating) {
      this.hasChanges.set(false);
      this.reviewForm.valueChanges.subscribe((values) => {
        this.hasChanges.set(
          +values.rating !== this.existingRating!.rating ||
          (values.comment ?? '') !== (this.existingRating!.comment ?? '')
        );
      });
    }
  }

  setRating(rating: number): void {
    this.reviewForm.patchValue({ rating });
  }

  onSubmit(): void {
    if (this.reviewForm.invalid) return;
    this._loader.showLoader();
    const { rating, comment } = this.reviewForm.value;
    this._appRatingService
      .upsertRating(this.appTypeId, +rating, comment)
      .pipe(finalize(() => this._loader.hideLoader()))
      .subscribe({
        next: (result) => {
          this._toastService.success(this._translate.instant('app-rating.success'), { duration: 2000 });
          this.modalCtrl.dismiss(result, MODAL_RESPONSE.SUCCESS);
        },
        error: () => {
          this._toastService.error(this._translate.instant('app-rating.error'), { duration: 2000 });
        },
      });
  }

  cancel(): void {
    this.modalCtrl.dismiss(null, MODAL_RESPONSE.CANCEL);
  }
}

import { Component, Input, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';
import { addIcons } from 'ionicons';
import { star, starOutline } from 'ionicons/icons';
import { TranslateModule } from '@ngx-translate/core';
import { ModalController } from '@ionic/angular/standalone';
import { MODAL_RESPONSE } from 'libs/shared/constants/enums';

@Component({
  selector: 'lib-submit-review',
  templateUrl: './submit-review.component.html',
  styleUrls: ['./submit-review.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    ReactiveFormsModule,
    UserAvatarComponent,
    TranslateModule,
  ],
})
export class SubmitReviewComponent {
  reviewForm: FormGroup;
  @Input() coachName = 'Gerardo Contreras';
  @Input() avatarUrl = '';

  submitReview = output<{ rating: number; description: string }>();

  stars: number[] = [1, 2, 3, 4, 5];

  constructor(private fb: FormBuilder, private modalCtrl: ModalController) {
    addIcons({ star, starOutline });
    this.reviewForm = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required]],
    });
  }

  setRating(rating: number) {
    this.reviewForm.patchValue({ rating });
  }

  onSubmit() {
    if (this.reviewForm.valid) {
      this.submitReview.emit(this.reviewForm.value);
    }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, MODAL_RESPONSE.CANCEL);
  }
}

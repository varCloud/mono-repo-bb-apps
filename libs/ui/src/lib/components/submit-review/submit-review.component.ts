import {
  Component,
  computed,
  Input,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
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
import { LoaderUIService, UserService } from '@monorepo-bb-app/core';
import { finalize } from 'rxjs';
import { ToastService, User, WorkoutService } from '@monorepo-bb-app/shared';

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
export class SubmitReviewComponent implements OnInit {
  reviewForm: FormGroup;
  @Input() userId = null;
  @Input() workoutId = null;

  creator = signal<User | null>(null);
  fullName = computed(() => {
    const user = this.creator();
    if (user) {
      return `${user.firstName} ${user.lastName}`;
    }
    return '';
  });

  submitReview = output<{ rating: number; description: string }>();

  stars: number[] = [1, 2, 3, 4, 5];

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private _loader: LoaderUIService,
    private _user: UserService,
    private _toastService: ToastService,
    private _workoutService: WorkoutService
  ) {
    addIcons({ star, starOutline });
    this.reviewForm = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1)]],
      comment: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.userId) {
      this.getCreatorProfile();
    }
  }

  setRating(rating: number) {
    this.reviewForm.patchValue({ rating });
  }

  onSubmit() {
    if (this.reviewForm.valid) {
      this.submitReview.emit(this.reviewForm.value);
    }

    this._workoutService
      .workoutRate(
        this.workoutId!,
        +this.reviewForm.value.rating,
        this.reviewForm.value.comment
      )
      .subscribe({
        next: () => {
          this._toastService.success('¡Gracias por tu evaluación!', {
            duration: 2000,
          });
          this.modalCtrl.dismiss(null, MODAL_RESPONSE.SUCCESS);
        },
        error: () => {
          this._toastService.error(
            'Hubo un error al enviar tu evaluación. Por favor, intenta de nuevo.',
            { duration: 2000 }
          );
        },
      });
  }

  cancel() {
    return this.modalCtrl.dismiss(null, MODAL_RESPONSE.CANCEL);
  }

  private getCreatorProfile() {
    this._loader.showLoader();
    this._user
      .getCreatorInfo(this.userId!)
      .pipe(finalize(() => this._loader.hideLoader()))
      .subscribe({
        next: (user) => {
          this.creator.set(user);
        },
        error: (err) => {
          this._toastService.error('Error al cargar el perfil del creador.', {
            duration: 1000,
          });
          this.cancel();
        },
      });
  }
}

import { JsonPipe } from '@angular/common';
import {
  Component,
  computed,
  effect,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';

import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import {
  IonInputOtp,
  IonCol,
  IonRow,
  IonGrid,
  IonText,
  IonButton,
} from '@ionic/angular/standalone';

import { TranslateModule } from '@ngx-translate/core';
import { TIME } from '@monorepo-bb-app/shared';
import { MaskEmailPipe } from '@monorepo-bb-app/shared';
import { OtpService } from '@monorepo-bb-app/shared';
import { ToastService } from '@monorepo-bb-app/shared';
import { LoaderUIService } from '@monorepo-bb-app/core';

const otpRequiredLength = (length: number) => {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value || value.toString().length !== length) {
      return { otpLength: true };
    }
    return null;
  };
};

@Component({
  standalone: true,
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
  imports: [
    IonButton,
    IonText,
    IonGrid,
    IonRow,
    IonCol,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    MaskEmailPipe,
  ],
  providers: [JsonPipe],
})
export class OtpComponent implements OnInit, OnDestroy {
  public email = input.required<string>();
  public apiUrl = input.required<string>();
  public showButtonSend = input<boolean>(true);
  public otpSuccess = output<boolean>();

  public otpForm: ReturnType<FormBuilder['group']>;

  public remainingSeconds = signal(TIME.OTP.TIME_IN_SECONDS);
  public isValidOtp = signal<boolean>(false);
  private intervalId = signal<any>(null);

  public displayTime = computed(() => {
    const seconds = this.remainingSeconds() % 60;
    const minutes = Math.floor(this.remainingSeconds() / 60);
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
  });

  constructor(
    private _fb: FormBuilder,
    private _otpService: OtpService,
    private _toastService: ToastService,
    private _globalBlockUIService: LoaderUIService,
  ) {
    this.otpForm = this._fb.group({
      otp: ['', [Validators.required, otpRequiredLength(4)]],
    });
    effect(() => {
      if (this.remainingSeconds() <= 0) {
        this.stopTimer();
      }
    });
  }

  ngOnInit() {
    this.getOtp();
    this.otpForm.get('otp')?.valueChanges.subscribe((value) => {
      if (value && value.toString().length === 4) {
        this.verifyOtp(value);
      }
    });
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  public resendOtp() {
    this.getOtp();
  }

  private startTimer(enableInput = true) {
    if (this.intervalId() !== null) {
      return;
    }
    if (enableInput) {
      this.otpForm.get('otp')?.enable({ emitEvent: false });
    }
    this.intervalId.set(
      setInterval(() => {
        this.remainingSeconds.update((s) => s - 1);
      }, 1000),
    );
  }

  private stopTimer() {
    if (this.intervalId() !== null) {
      clearInterval(this.intervalId());
      this.intervalId.set(null);
    }
  }

  private resetTimer() {
    this.stopTimer();
    this.remainingSeconds.set(TIME.OTP.TIME_IN_SECONDS);
    this.startTimer();
  }

  private getOtp() {
    if (!this.email()) {
      return;
    }
    this._globalBlockUIService.showLoader();
    this._otpService
      .getOtp({
        apiUrl: this.apiUrl(),
        email: this.email(),
        userTypeId: 3,
      })
      .subscribe({
        next: () => {
          this._globalBlockUIService.hideLoader();
          this.resetTimer();
        },
        error: (error) => {
          this._toastService.error('Error sending OTP', { duration: 3000 });
          this.otpForm.get('otp')?.disable();
          this.startTimer(false);
          this._globalBlockUIService.hideLoader();
        },
      });
  }

  private verifyOtp(otp: string) {
    this._globalBlockUIService.showLoader();
    this._otpService
      .verifyOtp({
        apiUrl: this.apiUrl(),
        email: this.email(),
        otp,
        userTypeId: 3,
      })
      .subscribe({
        next: () => {
          this._globalBlockUIService.hideLoader();
          this.otpSuccess.emit(true);
          this.isValidOtp.set(true);
          this.otpForm.get('otp')?.disable({ emitEvent: false });
        },
        error: (error) => {
          this._toastService.error('Error verifying OTP', { duration: 3000 });
          this._globalBlockUIService.hideLoader();
        },
      });
  }
}

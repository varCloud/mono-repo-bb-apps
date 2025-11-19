import { Component, OnInit, signal } from '@angular/core';
import {
    IonContent,
    IonCol,
    IonRow,
    IonGrid,
    IonButton,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import {
    HeaderComponent,
    LayoutContentComponent,
    OtpComponent,
} from '@monorepo-bb-app/ui';
import { CreateAccountService } from '../../../services/create-account.service';
import { Router } from '@angular/router';
import { API_URLS } from '@monorepo-bb-app/shared';
import { LoginService } from '@monorepo-bb-app/core';
import { ToastService } from '@monorepo-bb-app/shared';
import { LoaderUIService } from '@monorepo-bb-app/core';
import { ENUM_TYPE_USER } from 'libs/shared/constants/enums';
import { switchMap, finalize, catchError, of, delay } from 'rxjs';

@Component({
    selector: 'app-create-account-otp',
    templateUrl: './otp.component.html',
    styleUrls: ['./otp.component.scss'],
    imports: [
        IonButton,
        IonGrid,
        IonRow,
        IonCol,
        IonContent,
        TranslateModule,
        LayoutContentComponent,
        HeaderComponent,
        OtpComponent,
    ],
    providers: [TranslatePipe],
})
export class OtpCreateAccountComponent implements OnInit {
    email = signal<string>('');
    isSuccessOtp = signal<boolean>(false);
    apiUrl = API_URLS.USER_OTP;
    readonly userTypeId = ENUM_TYPE_USER.PROSPECT;
    private readonly SUCCESS_DELAY_MS = 1500;

    constructor(
        private _createAccountService: CreateAccountService,
        private _router: Router,
        private _loginService: LoginService,
        private _toastService: ToastService,
        private _translate: TranslatePipe,
        private _loader: LoaderUIService
    ) {
        if (!this._createAccountService.getUser()?.email) {
            this._router.navigate(['/create-account']);
        }
        this.email.set(this._createAccountService.getUser()!.email);
    }

    ngOnInit() {

    }

    onOtpSuccess(event: boolean) {
        this.isSuccessOtp.set(event);
        this.createUserAccount();
    }

    public createUserAccount() {
        if (!this.isSuccessOtp()) {
            return;
        }
        
        this._loader.showLoader();
        
        const user = {
            email: this.email(),
            passwordHash: this._createAccountService.getUser()!.passwordHash,
            userTypeId: this._createAccountService.getUser()!.userTypeId,
        };

        this._createAccountService.createAccount(user)
            .pipe(
                switchMap((createAccountResponse:any) => {
                    this._toastService.success(
                        this._translate.transform('user-create-account.create-account-success')
                    );
                    
                    return this._loginService.login({
                        email: user.email,
                        password: user.passwordHash,
                        userType: ENUM_TYPE_USER.ATHLETE
                    });
                }),
                switchMap((useLoginResponse) => {
                    return of(useLoginResponse).pipe(delay(this.SUCCESS_DELAY_MS));
                }),
                finalize(() => this._loader.hideLoader()),
                catchError((error) => {
                    this.handleError(error);
                    return of(null);
                })
            )
            .subscribe({
                next: (useLoginResponse) => {
                    if (useLoginResponse) {
                        this._router.navigate(['/home']);
                    }
                }
            });
    }

    private handleError(error: any): void {
        const errorMessage = error?.error?.message || this._translate.transform('error-processing');
        this._toastService.error(errorMessage);
        this._router.navigate(['/login']);
    }
}
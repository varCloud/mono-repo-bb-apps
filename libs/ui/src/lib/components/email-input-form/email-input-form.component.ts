import { Component, output } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,
} from '@angular/forms';
import {
  IonRow,
  IonCol,
  IonGrid,
  IonInput,
  IonButton,
  IonText,
  IonImg,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-email-input-form',
  templateUrl: './email-input-form.component.html',
  styleUrls: ['./email-input-form.component.scss'],
  standalone: true,
  imports: [
    IonImg,
    IonText,
    IonButton,
    IonInput,
    IonCol,
    IonRow,
    IonGrid,
    ReactiveFormsModule,
    TranslateModule,
  ],
})
export class EmailInputFormComponent {
  // Output siguiendo estándares de la app
  emailSubmit = output<string>();

  emailForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.emailForm = this.formBuilder.group({
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(100)],
      ],
    });
  }

  onSubmit() {
    if (this.emailForm.valid) {
      this.emailSubmit.emit(this.emailForm.value.email);
    }
  }
}
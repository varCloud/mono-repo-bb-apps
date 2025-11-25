import {
  Component,
  EventEmitter,
  input,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  GENDER_OPTIONS,
  Countrycode,
} from '@monorepo-bb-app/shared';
import { Photo } from '@capacitor/camera';
import { IonicModule } from '@ionic/angular';
import { LayoutContentComponent } from '../layout-content';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { IonContent } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ViewChild, ElementRef } from '@angular/core';
import { InputPhoneComponent } from '../input-phone/input-phone.component';


@Component({
  selector: 'lib-app-profile-editor',
  templateUrl: './form-personal-data-creator.component.html',
  styleUrls: ['./form-personal-data-creator.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    ReactiveFormsModule,
    InputPhoneComponent,
    CommonModule,
    IonContent,
    LayoutContentComponent,
    TranslateModule,
    ErrorMessageComponent,
  ],
})
export class FormPersonalDataCreatorComponent implements OnInit {
  profileForm: FormGroup;
  showLogoHeader = input<boolean>(false);
  genderOpt = GENDER_OPTIONS;

  @Input() initialData: any;
  @Output() saveClicked = new EventEmitter();
  @ViewChild('colorPicker') colorPicker!: ElementRef;
  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      nickname: ['', Validators.required],
      birthDate: [new Date().toISOString(), Validators.required],
      gender: [3, Validators.required],
      countryCodePrefix: ['+52', Validators.required],
      phoneNumber: [
        '9898989898',
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      profileColor: ['#000000'],
      imageProfile: ['/prueba/', Validators.required],
    });
  }

  ngOnInit() {
    if (this.initialData) {
      this.profileForm.patchValue(this.initialData);
    }
  }

  onMaskSelected(mask: Countrycode) {
    this.profileForm.controls['countryCodePrefix'].setValue(mask.dialCode);
  }

  openColorPicker() {
    this.colorPicker.nativeElement.click();
    console.log(this.colorPicker);
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const formData: any = {
        ...this.initialData,
        ...this.profileForm.value,
      };
      this.saveClicked.emit(formData);
    } else {
      this.profileForm.markAllAsTouched();
      console.error('El formulario no es válido');
    }
  }
}

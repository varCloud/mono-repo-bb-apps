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
import { GENDER_OPTIONS, Countrycode } from '@monorepo-bb-app/shared';
import { Photo } from '@capacitor/camera';
import { IonicModule } from '@ionic/angular';
import { LayoutContentComponent } from '../layout-content';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { IonContent } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ViewChild, ElementRef } from '@angular/core';
import { InputPhoneComponent } from '../input-phone/input-phone.component';
import { UploadService } from '@monorepo-bb-app/core';
import { AvatarPickerComponent } from '../avatar-picker/avatar-picker.component';

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
    AvatarPickerComponent,
  ],
})
export class FormPersonalDataCreatorComponent implements OnInit {
  @Input() profileForm!: FormGroup;
  showLogoHeader = input<boolean>(false);
  genderOpt = GENDER_OPTIONS;
  @Input() initialData: any = {};
  @Output() saveClicked = new EventEmitter<any>();
  @Output() imageSelected = new EventEmitter<string>();
  @ViewChild('colorPicker') colorPicker!: ElementRef;
  @Input() textButton?: any;
  @Output() maskSelected = new EventEmitter<Countrycode>();

  constructor() {}

  ngOnInit() {
    if (this.initialData) {
      this.profileForm.patchValue(this.initialData);
    }
  }
  onMaskSelected(mask: Countrycode) {
    this.maskSelected.emit(mask);
  }

  openColorPicker() {
    this.colorPicker.nativeElement.click();
    console.log(this.colorPicker);
  }

  onImageSelected(image: any) {
    this.imageSelected.emit(image);
  }

  isValid(): boolean {
    return this.profileForm.valid;
  }
  getValue(): any {
    return this.profileForm.value;
  }
}

import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { IonInput, IonRow, IonCol } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { AvatarPickerComponent, ErrorMessageComponent, InputPhoneComponent } from '@monorepo-bb-app/ui';
import { Countrycode } from '@monorepo-bb-app/shared';

@Component({
  selector: 'app-athlete-profile-basic-form',
  templateUrl: './athlete-profile-basic-form.component.html',
  styleUrls: ['./athlete-profile-basic-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    IonInput,
    IonRow,
    IonCol,
    AvatarPickerComponent,
    ErrorMessageComponent,
    InputPhoneComponent
  ]
})
export class AthleteProfileBasicFormComponent implements OnInit {
  @Input() form!: FormGroup;
  @Input() initialData: any = {};
  @Output() formSubmit = new EventEmitter<any>();
  @Output() imageSelected = new EventEmitter<string>();
  @Output() maskSelected = new EventEmitter<Countrycode>();

  constructor() {}

  ngOnInit() {
    if (!this.form) {
      throw new Error('Form control is required for AthleteProfileBasicFormComponent');
    }

    if (this.initialData) {
      this.form.patchValue(this.initialData);
    }
  }

  onImageSelected(image: string) {
    this.imageSelected.emit(image);
  }

  onMaskSelected(mask: Countrycode) {
    this.maskSelected.emit(mask);
  }

  isValid(): boolean {
    return this.form.valid;
  }

  getValue(): any {
    return this.form.value;
  }
}
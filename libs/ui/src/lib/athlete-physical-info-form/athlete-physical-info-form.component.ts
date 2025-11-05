import { Component, EventEmitter, Input, Output, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ErrorMessageComponent, RadioCardSelectorComponent, SelectOption } from '@monorepo-bb-app/ui';

@Component({
  selector: 'app-athlete-physical-info-form',
  templateUrl: './athlete-physical-info-form.component.html',
  styleUrls: ['./athlete-physical-info-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule,
    ErrorMessageComponent,
    RadioCardSelectorComponent,
    TranslateModule
  ]
})
export class AthletePhysicalInfoFormComponent implements OnInit {
  @Input() form!: FormGroup;
  @Input() initialData: any = {};
  @Output() formSubmit = new EventEmitter<any>();
  @Output() genderChange = new EventEmitter<string>();
  @Output() birthdateChange = new EventEmitter<void>();
  public genderOptions = signal<SelectOption[]>([]);
  constructor(
    private _translate: TranslateService
  ) {}

  ngOnInit() {
    if (!this.form) {
      throw new Error('Form control is required for AthletePhysicalInfoFormComponent');
    }

    if (this.initialData) {
      this.form.patchValue(this.initialData);
    }
    this.loadGenderOptions();
  }

  onGenderChange(value: string) {
    this.form.get('gender')?.setValue(value);
    this.genderChange.emit(value);
  }

  onBirthdateChange() {
    this.birthdateChange.emit();
  }

  getMaxDate(): string {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 13);
    return date.toISOString();
  }

  isValid(): boolean {
    return this.form.valid;
  }

  getValue(): any {
    return this.form.value;
  }


  private loadGenderOptions() {
    this._translate.get(['genders.male', 'genders.female', 'genders.other']).subscribe(translations => {
      this.genderOptions.set([
        { value: 1, label: translations['genders.male'], image: 'assets/icons/onboarding/male.svg' },
        { value: 2, label: translations['genders.female'], image: 'assets/icons/onboarding/female.svg' },
        { value: 3, label: translations['genders.other'], image: 'assets/icons/onboarding/none.svg' }
      ]);
    });
  }
}
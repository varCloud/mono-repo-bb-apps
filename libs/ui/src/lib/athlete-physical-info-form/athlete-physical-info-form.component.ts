import { Component, EventEmitter, Input, Output, OnInit, signal, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ErrorMessageComponent, RadioCardSelectorComponent, SelectOption } from '@monorepo-bb-app/ui';
import { addIcons } from 'ionicons';
import { cardOutline, female, femaleOutline, maleOutline } from 'ionicons/icons';
import { IonInput,IonCol, IonLabel,IonDatetime ,IonDatetimeButton, IonItemDivider,IonItem, IonRow, IonModal} from '@ionic/angular/standalone';

@Component({
  selector: 'app-athlete-physical-info-form',
  templateUrl: './athlete-physical-info-form.component.html',
  styleUrls: ['./athlete-physical-info-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    
    ReactiveFormsModule,
    TranslateModule,
    ErrorMessageComponent,
    RadioCardSelectorComponent,
    TranslateModule,
    IonDatetime,
    IonDatetimeButton,
    IonRow, 
    IonCol,
    IonItem,
    IonLabel,
    IonItemDivider,
    IonModal,
    IonInput
  ]
})
export class AthletePhysicalInfoFormComponent implements OnInit , OnChanges {
  @Input() form!: FormGroup;
  @Input() initialData: any = {};
  @Output() formSubmit = new EventEmitter<any>();
  @Output() genderChange = new EventEmitter<string>();
  @Output() birthdateChange = new EventEmitter<void>();
  public genderOptions = signal<SelectOption[]>([]);
  public maxDate = signal<string>('');
  
  constructor( private _translate: TranslateService) {
     addIcons({ cardOutline, femaleOutline, maleOutline, });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Changes detected:', changes);
  }

  ngOnInit() {
    if (!this.form) {
      throw new Error('Form control is required for AthletePhysicalInfoFormComponent');
    }

    if (this.initialData) {
      this.form.patchValue(this.initialData);
    }
    this.loadGenderOptions();
    this.initializeMaxDate();
  }

  onGenderChange(value: string) {
    this.form.get('gender')?.setValue(value);
    this.genderChange.emit(value);
  }

  onBirthdateChange() {
    this.birthdateChange.emit();
     const birthdate = this.form.get('birthdate')?.value;
    if (birthdate) {
      const age = this.calculateAge(new Date(birthdate));
      this.form.patchValue({ age: age.toString() });
    }
  }

  private calculateAge(birthdate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDiff = today.getMonth() - birthdate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
      age--;
    }

    return age;
  }

  private initializeMaxDate(): void {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 13);
    this.maxDate.set(date.toISOString());
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
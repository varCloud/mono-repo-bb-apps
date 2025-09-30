import {
  ChangeDetectionStrategy,
  Component,
  input,
  type OnInit,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  IonCard,
  IonCardContent,
  IonGrid,
  IonInput,
  IonRow,
  IonCol,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorMessageComponent } from '../error-message/error-message.component';

@Component({
  selector: 'lib-add-recorded-class',
  imports: [
    IonCol,
    IonRow,
    IonInput,
    IonGrid,
    IonCardContent,
    IonCard,
    TranslateModule,
    ReactiveFormsModule,
    ErrorMessageComponent,
    ErrorMessageComponent,
  ],
  templateUrl: './add-recorded-class.component.html',
  styleUrl: './add-recorded-class.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddRecordedClassComponent implements OnInit {
  titleControl = input.required<FormControl<string>>();
  urlControl = input.required<FormControl<string>>();
  ngOnInit(): void {}
}

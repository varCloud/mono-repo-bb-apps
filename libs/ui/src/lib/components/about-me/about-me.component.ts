import { Component, effect, EventEmitter, Input, model, OnInit, Output, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent,
  IonButton,
  IonGrid,
  IonCol,
  IonRow,
  IonTextarea, IonInput
} from '@ionic/angular/standalone';
import { HeaderComponent } from '../header/header.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {LayoutContentComponent} from '../layout-content';
//import { HeaderComponent, LayoutContentComponent } from '@monorepo-bb-app/ui';
//import { ProfileIncompleteService } from '../../../services/profile-incomplete.service';
//import {ProfileIncompleteService} from '../../../../../../apps/creator/src/app/features/user/services/profile-incomplete.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '@monorepo-bb-app/shared';
//import { UserService } from '../../../services/user.service';
import { finalize } from 'rxjs';
import { LoaderUIService, SesionService } from '@monorepo-bb-app/core';
import { ErrorMessageComponent } from '@monorepo-bb-app/ui';



@Component({
  selector: 'lib-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss'],
  imports: [
    IonInput,
    IonTextarea,
    IonRow,
    IonCol,
    IonGrid,
    IonButton,
    IonContent,
    LayoutContentComponent,
    HeaderComponent,
    TranslateModule,
    ReactiveFormsModule,
  ErrorMessageComponent
  ],
})
export class AboutMeComponent2 implements OnInit {
@Input() formAboutMe!: FormGroup;
@Input() initialDataAboutMe: any = {};
@Output() formSubmit = new EventEmitter<any>();
@Output() valueChange = new EventEmitter<string>();
@Input() value?: string = '';

  ngOnInit() {
    if (!this.formAboutMe) {
      throw new Error('formAbouMe control is required for AboutMeComponent');
    }
        if (this.initialDataAboutMe) {
      this.formAboutMe.patchValue(this.initialDataAboutMe);
    }

  }

  isValid(): boolean {
    return this.formAboutMe.valid;
  }

  getValue(): any {
    return this.formAboutMe.value;
  }

onInputChange(event: any) {
    const val = event.detail.value;
    this.value = val;
    this.valueChange.emit(val);
  }

}

import { NgClass } from '@angular/common';
import { Component, input, OnInit, output } from '@angular/core';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonCardContent,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-card-onboarding',
  templateUrl: './card-onboarding.component.html',
  styleUrls: ['./card-onboarding.component.scss'],
  imports: [
    IonCardContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonButton,
    TranslateModule,
    NgClass
    
],
})
export class CardOnboardingComponent implements OnInit {
  title = input.required<string>();
  description = input<string>('');
  image = input.required<string>();
  buttonText = input<string>('next');
  customClass = input<string>('');
  continueAction = output();
  skipAction = output();
  constructor() {}

  ngOnInit() {}

  onContinue() {
    this.continueAction.emit();
  }

  onSkip() {
    this.skipAction.emit();
  }
}

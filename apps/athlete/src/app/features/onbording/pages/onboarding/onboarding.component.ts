import { Component, OnInit } from '@angular/core';
import { IonContent, IonText, IonButton } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
  imports: [IonButton, IonText, IonContent, RouterLink, TranslateModule],
})
export class OnboardingComponent implements OnInit {
  constructor() {}

  async ngOnInit() {}
}

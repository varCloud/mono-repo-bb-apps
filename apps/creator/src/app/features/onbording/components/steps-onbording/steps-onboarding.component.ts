import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnInit, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, NavController } from '@ionic/angular/standalone';
import { StepsOnboardingComponent } from '@monorepo-bb-app/ui';

@Component({
  selector: 'app-steps-onboarding-page',
  templateUrl: './steps-onboarding.component.html',
  styleUrls: ['./steps-onboarding.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonContent, StepsOnboardingComponent],
})
export class StepsOnboardingPage implements OnInit {
  swiperRef = viewChild<ElementRef>('swiperRef');
  constructor(private router: NavController) {}

  ngOnInit() {}

  nextSlide() {
    if (!this.swiperRef) {
      return;
    }
    this.swiperRef()?.nativeElement.swiper.slideNext();
  }

  goToLogin() {
    this.router.navigateRoot(['/login'], { replaceUrl: true });
  }
}

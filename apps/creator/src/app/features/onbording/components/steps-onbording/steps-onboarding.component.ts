import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  OnInit,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { CardOnboardingComponent } from '../card-onboarding/card-onboarding.component';

@Component({
  selector: 'app-steps-onboarding',
  templateUrl: './steps-onboarding.component.html',
  styleUrls: ['./steps-onboarding.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonContent, CardOnboardingComponent],
})
export class StepsOnboardingComponent implements OnInit {
  swiperRef = viewChild<ElementRef>('swiperRef');
  constructor(private router: Router) {}

  ngOnInit() {}

  nextSlide() {
    if (!this.swiperRef) {
      return;
    }
    this.swiperRef()?.nativeElement.swiper.slideNext();
  }

  goToLogin() {
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}

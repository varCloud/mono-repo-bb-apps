import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  OnInit,
  viewChild,
  Input,
  input,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  IonContent,
  IonButton,
  IonText,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCard,
} from '@ionic/angular/standalone';
import { SwiperContainer } from 'swiper/element';
import { CardOnboardingComponent } from '../card-onboarding/card-onboarding.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-steps-onboarding',
  templateUrl: './steps-onboarding.component.html',
  styleUrls: ['./steps-onboarding.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    IonCard,
    IonCardTitle,
    IonCardHeader,
    IonCardContent,
    IonText,
    IonButton,
    IonContent,
    RouterLink,
    CardOnboardingComponent,
    CommonModule
  ],
})
export class StepsOnboardingComponent implements OnInit {
  swiperRef = viewChild<ElementRef>('swiperRef');
  customClass = input<string>('');
  @Input() onboardingSteps: Array<{
    title: string;
    image: string;
    description: string;
  }> = [
    {
      title: 'steps-onboarding.step-1-title',
      image: '/assets/images/welcome/slice-1.png',
      description: 'steps-onboarding.step-1-description',
    },
    {
      title: 'steps-onboarding.step-2-title',
      image: '/assets/images/welcome/slice-2.png',
      description: 'steps-onboarding.step-2-description',
    },
    {
      title: 'steps-onboarding.step-3-title',
      image: '/assets/images/welcome/slice-3.png',
      description: 'steps-onboarding.step-3-description',
    },
  ];

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

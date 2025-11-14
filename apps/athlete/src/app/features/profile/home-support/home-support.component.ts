import { Component, input, signal } from '@angular/core';
import { FaqCategories, InfoCardData } from '@monorepo-bb-app/shared';
import { CardSliderComponent } from '@monorepo-bb-app/ui';
import { IonContent } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  informationCircle,
  informationCircleOutline,
  callOutline,
  mailOutline,
  listOutline,
  mail,
  call,
  personCircleOutline,
  businessOutline,
  helpCircleOutline,
  arrowBackOutline,
} from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AccordionComponent,
  SimpleSearchInputComponent,
  ToolBarComponent,
} from '@monorepo-bb-app/ui';
import { Faq, RequestFaqs } from '@monorepo-bb-app/shared';
import { FaqService, FaqCategoriesService } from '@monorepo-bb-app/core';
import { take } from 'rxjs';
@Component({
  selector: 'app-home-support',

  templateUrl: 'home-support.component.html',
  styleUrls: ['home-support.component.scss'],
  standalone: true,
  imports: [
    ToolBarComponent,
    FormsModule,
    CommonModule,
    CardSliderComponent,
    SimpleSearchInputComponent,
    IonContent,
    AccordionComponent,
  ],
})
export class HomeSupport {
  public leftIcon = input<string>('arrow-back-outline');
  public backLink = input<string>('https://google.com');
  public title = input<string>('Help');
  public emailLink = input<string>('gusmg90@gmail.com');
  public emailIcon = input<string>('mail-outline');
  public phoneIcon = input<string>('call-outline');
  public phoneLink = input<string>('+524432426259');
  public mySearchText?: string = '';

  constructor(
    private faqCategoriesService: FaqCategoriesService,
    private faqService: FaqService
  ) {
    addIcons({
      informationCircle,
      informationCircleOutline,
      callOutline,
      mailOutline,
      listOutline,
      mail,
      call,
      personCircleOutline,
      businessOutline,
      helpCircleOutline,
      arrowBackOutline,
    });
    this.getFaqsCategories();
  }

  cardCategories: InfoCardData[] = [];
  myFaqList: Faq[] = []; //accordion

  public getFaqsCategories() {
    this.faqCategoriesService
      .getFaqsCategories()
      .pipe(take(1))
      .subscribe((response: FaqCategories[]) => {
        this.cardCategories = response;
        this.getFacts(Number(this.cardCategories[0].id));
      });
  }

  public getFacts(categoryId: number) {
    const payload: RequestFaqs = {
      categoryId: categoryId,
      userTypeId: 1,
    };
    this.faqService
      .getFaqs(payload)
      .pipe(take(1))
      .subscribe((response: Faq[]) => {
        this.myFaqList = response;
      });
  }
  //info slider

  onSliderCardClicked(cardId: string) {
    this.getFacts(Number(cardId));
  }

  //search input

  onSearchTextChange(newText: string) {
    this.mySearchText = newText;
  }

  onSearchSubmit(submittedText: string) {}

  onSearchClearEvent() {
    this.mySearchText = '';
  }
}

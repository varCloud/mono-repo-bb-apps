import { Component, input, signal, WritableSignal, inject } from '@angular/core';
import { FaqCategories, InfoCardData, AppConfig2Model } from '@monorepo-bb-app/shared';
import { CardSliderComponent, FaqSearchModalComponent } from '@monorepo-bb-app/ui';
import { IonContent, ModalController } from '@ionic/angular/standalone';


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
import { FaqService, FaqCategoriesService,AppConfig2Service } from '@monorepo-bb-app/core';
import { take } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

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
    TranslateModule,
    FaqSearchModalComponent,

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
  cardCategories: InfoCardData[] = [];
  appConfig2: AppConfig2Model[] = [];
  phoneLinkSignal = signal('');
  mailLinkSignal = signal('');

  public myFaqList: WritableSignal<Faq[]> = signal([]);

  constructor(
    private faqCategoriesService: FaqCategoriesService,
    private faqService: FaqService,
    private modalCtrl: ModalController,
    private appConfig2Service: AppConfig2Service
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
    this.getAppConfig();
  }


    public getAppConfig() {
    this.appConfig2Service
      .getAppConfig()
      .pipe(take(1))
      .subscribe((response: AppConfig2Model[]) => {
        this.appConfig2 = response;
        this.phoneLinkSignal.set(this.appConfig2[13]['value'] || '');
        this.mailLinkSignal.set(this.appConfig2[12]['value'] || '');
      });
  }

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
        this.myFaqList.set(response);
      });

  }






  async openSearchModal() {
    const modal = await this.modalCtrl.create({
      component: FaqSearchModalComponent,
      componentProps: {
        allFaqs: this.myFaqList

      },
      breakpoints: [0, 0.25, 0.5, 0.75, 1],
      cssClass: 'bottom-sheet-modal',
    });

    await modal.present();

    const result = await modal.onDidDismiss();
    if (result.data) {
      console.log('Modal Data:', result.data);
    }
  }




  //info slider

  onSliderCardClicked(cardId: string) {
    this.getFacts(Number(cardId));
  }

}

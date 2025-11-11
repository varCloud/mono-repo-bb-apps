
import { input, Component, ViewChild, OnInit } from '@angular/core';
import { IonCol, IonContent, IonFooter, IonToolbar, IonButton } from '@ionic/angular/standalone';
import { TabMenuService } from '@monorepo-bb-app/core';
import { ToolBarComponent } from '@monorepo-bb-app/ui';

@Component({
  selector: 'app-become-creator-detail',
  templateUrl: 'become-creator-detail.page.html',
  styleUrls: ['become-creator-detail.page.scss'],
  standalone: true,
  imports: [
    ToolBarComponent,
    IonCol,
    IonContent, IonFooter, IonToolbar, IonButton
],
})

export class BecomeCreatorDetailComponent implements OnInit {

  constructor(
    private _tabMenuService: TabMenuService
  ) {}

  ngOnInit(): void {
    this._tabMenuService.hideLoader();
    console.log('iniciando component de become-creator-detail');
  }


  @ViewChild(IonContent, { static: false }) content: IonContent | undefined;


  scrollToTop() {
    this.content?.scrollToTop(500);
  }

  public leftIcon = input<string>('arrow-back-outline');
  public backLink = input<string>('https://google.com');

  public title = input<string>('Help');

  public emailLink = input<string>('');
  public emailIcon = input<string>('mail-outline');

  public phoneIcon = input<string>('call-outline');
  public phoneLink = input<string>('');


  ionViewWillLeave() {
    this._tabMenuService.showMenu();
  }
}

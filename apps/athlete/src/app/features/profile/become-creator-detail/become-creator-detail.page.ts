import { IonContent } from '@ionic/angular';
import {ToolBarComponent} from '../support/toolbar/toolbar.component';
import { input,Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { IonFab, IonFabButton } from '@ionic/angular/standalone';
import { TabMenuService } from '@monorepo-bb-app/core';

@Component({
  selector: 'app-become-creator-detail',
  templateUrl: 'become-creator-detail.page.html',
  styleUrls: ['become-creator-detail.page.scss'],
  standalone: true,
  imports: [
    ToolBarComponent,
    IonFab, IonFabButton
  ],
})

export class BecomeCreatorDetailComponent implements OnInit{
// let obj= new BecomeCreatorDetailComponent();
constructor(
  private _tabMenuService : TabMenuService
){

}


  ngOnInit(): void {
    this._tabMenuService.hideLoader();
   console.log('iniciando component de become-creator-detail');
  }


@ViewChild(IonContent, { static: false }) content: IonContent | undefined;


  scrollToTop() {
    this.content?.scrollToTop(500); // Scrolls to the top with a 500ms animation
  }

//------------------------------------------------------------- inicio contact item -------------------------------------------------
  public leftIcon = input<string>('arrow-back-outline');
  public backLink = input<string>('https://google.com');

  public title = input<string>('Help');

  public emailLink = input<string>('');
  public emailIcon = input<string>('mail-outline');

  public phoneIcon = input<string>('call-outline');
  public phoneLink = input<string>('');

//------------------------------------------------------------- fin contact item -------------------------------------------------
  // ngOnDestroy(): void {
  //   console.log('destruyendo component de become-creator-detail');
  //   this._tabMenuService.showMenu();
  // }

ionViewWillLeave() {
console.log('destruyendo component de become-creator-detail');
this._tabMenuService.showMenu();
  }
}

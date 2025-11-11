import { Component, effect, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonContent,
  IonText,
} from '@ionic/angular/standalone';
import { SesionService, UserService } from '@monorepo-bb-app/core';
import { TabMenuService } from '@monorepo-bb-app/core';
import { addIcons } from 'ionicons';
import {
  chatboxEllipsesOutline,
  homeOutline,
  personOutline,
  pricetagOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    IonText,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonContent,
    RouterLink],
})
export class HomeComponent implements OnInit {
  public showMenu = true;
  constructor(
    private router: Router,
    private _userService: UserService,
    private _sesionService: SesionService,
    private _tabMenuService: TabMenuService
  ) {
    addIcons({
      homeOutline,
      chatboxEllipsesOutline,
      pricetagOutline,
      personOutline,
    });
    effect(() => {
      this.showMenu = this._tabMenuService.getShowMenu();
      console.log('Tab Menu Loading State:', this.showMenu);
      console.log('Usuario en sesión:', this._sesionService.user$());
      const user = this._sesionService.user$();
      this._userService.updatePushTokenIfSessionActive();
    });
  }

  ngOnInit() { }

  onRedirectTabButton(url: string) {
    console.log('Redirecting to:', url);
    this.router.navigateByUrl('/home/profile');
  }
}

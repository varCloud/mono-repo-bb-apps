import { Component, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonContent,
  IonText,
} from '@ionic/angular/standalone';
import { SesionService, UserService } from '@monorepo-bb-app/core';
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
  imports: [IonText, IonTabs, IonTabBar, IonTabButton, IonIcon, IonContent],
})
export class HomeComponent implements OnInit {
  constructor(
    private router: Router,
    private _userService: UserService,
    private _sesionService: SesionService
  ) {
    addIcons({
      homeOutline,
      chatboxEllipsesOutline,
      pricetagOutline,
      personOutline,
    });

    effect(() => {
      const user = this._sesionService.user$();
      console.log('Usuario en sesión:', this._sesionService.user$());
      this._userService.updatePushTokenIfSessionActive();
    });
  }
  
  ngOnInit() {

  }

  onRedirectTabButton(url: string) {
    console.log('Redirecting to:', url);
    this.router.navigateByUrl('/home/profile');
  }
}

import { Component, effect, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProfileColorService, UserService } from '@monorepo-bb-app/core';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonContent,
  IonText,
} from '@ionic/angular/standalone';
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
  imports: [IonText, IonTabs, IonTabBar, IonTabButton, IonIcon, IonContent,RouterLink],
})
export class HomeComponent implements OnInit {
  constructor(
    private router: Router,
    public colorService: ProfileColorService,
    private _userService: UserService,
  ) {
    addIcons({
      homeOutline,
      chatboxEllipsesOutline,
      pricetagOutline,
      personOutline,
    });

    effect(() => {
        this._userService.updatePushTokenIfSessionActive();
    })
  }

  ngOnInit() {}

  onRedirectTabButton(url: string) {
    this.router.navigateByUrl('/home/profile');
  }
}

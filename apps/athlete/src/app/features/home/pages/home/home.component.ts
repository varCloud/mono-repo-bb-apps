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
import { addIcons } from 'ionicons';
import {
  chatboxEllipsesOutline,
  homeOutline,
  personOutline,
  pricetagOutline,
} from 'ionicons/icons';
import { IonicModule } from "@ionic/angular";
import { CommonModule } from '@angular/common';

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
      this._userService.updatePushTokenIfSessionActive();
    });
  }

  ngOnInit() { }

  onRedirectTabButton(url: string) {
    console.log('Redirecting to:', url);
    this.router.navigateByUrl('/home/profile');
  }
}

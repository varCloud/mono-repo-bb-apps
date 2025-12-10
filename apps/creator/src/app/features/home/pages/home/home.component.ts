import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProfileColorService } from '@monorepo-bb-app/core';
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
    public colorService: ProfileColorService
  ) {
    addIcons({
      homeOutline,
      chatboxEllipsesOutline,
      pricetagOutline,
      personOutline,
    });
  }

  ngOnInit() {}

  onRedirectTabButton(url: string) {
    console.log('Redirecting to:', url);
    this.router.navigateByUrl('/home/profile');
  }
}

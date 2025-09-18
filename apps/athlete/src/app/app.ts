import { Component, effect, OnInit, signal } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, RouterModule],
})
export class App implements OnInit {
  public isLoading = signal(false);

  constructor() {}

  ngOnInit() {}
}

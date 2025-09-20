import { CommonModule } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { StatusBar } from '@capacitor/status-bar';
import { IonBackButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-layout-content',
  templateUrl: './layout-content.component.html',
  styleUrls: ['./layout-content.component.scss'],
  imports: [IonBackButton, CommonModule],
})
export class LayoutContentComponent implements OnInit {
  public customClass = input<string>('');
  public useGoBack = input<boolean>(false);
  public title = input<string>('');

  constructor() {
    addIcons({ arrowBackOutline });
  }

  ngOnInit() {
    if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android') {
      StatusBar.setOverlaysWebView({ overlay: false });
    }
  }
}

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'bb-card',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-card [color]="color">
      <ion-card-header><h1>se reflejja el cambio en caliente</h1>
        <ion-card-title>{{ title }}</ion-card-title>
        <ion-card-subtitle *ngIf="subtitle">{{ subtitle }}</ion-card-subtitle>
      </ion-card-header>
      <ion-card-content>
        <ng-content></ng-content>
      </ion-card-content>
    </ion-card>
  `,
  styles: [`
    :host {
      display: block;
    }
    ion-card {
      margin: 16px;
    }
  `]
})
export class CardComponent {
  @Input() title = '';
  @Input() subtitle?: string;
  @Input() color?: string;
}
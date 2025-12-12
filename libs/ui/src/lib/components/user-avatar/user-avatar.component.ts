import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CONSTANTS } from '@monorepo-bb-app/shared';

@Component({
  selector: 'app-user-avatar',
  template: `
    <ion-avatar [attr.slot]="slot" [class]="size">
      <img [src]="avatarUrl" [alt]="altText" (error)="onImageError()" />
    </ion-avatar>
  `,
  styleUrls: ['./user-avatar.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class UserAvatarComponent implements OnInit, OnChanges {
  @Input() src: string = '';
  @Input() alt: string = 'user avatar';
  @Input() slot: string = 'start';
  @Input() size: 'small' | 'medium' | 'large' | 'extra-large' = 'medium';

  private _avatarUrl: string = CONSTANTS.DEFAULT_URL_AVATAR;

  get avatarUrl(): string {
    return this._avatarUrl;
  }

  get altText(): string {
    return this.alt;
  }

  ngOnInit() {
    this.setAvatarUrl();
  }

  ngOnChanges() {
    this.setAvatarUrl();
  }

  private setAvatarUrl(): void {
    if (!this.src || this.src.trim() === '') {
      this._avatarUrl = CONSTANTS.DEFAULT_URL_AVATAR;
    } else {
      this._avatarUrl = this.src;
    }
  }

  onImageError(): void {
    this._avatarUrl = CONSTANTS.DEFAULT_URL_AVATAR;
  }
}

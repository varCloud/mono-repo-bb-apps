
import { Component, effect, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { cameraOutline, send, sendSharp } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { CONSTANTS } from '@monorepo-bb-app/shared';
import { ProfileColorService } from '@monorepo-bb-app/core';

@Component({
  selector: 'app-avatar-profile',
  templateUrl: './avatar-profile.component.html',
  styleUrls: ['./avatar-profile.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class AvatarProfileComponent {
  @Input() imageUrl?: string;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() showEditButton: boolean = false;
  @Input() disabled: boolean = false;
  @Output() changeImage = new EventEmitter<void>();
  COLOR:string=CONSTANTS.USER_DEFAULT_COLOR;
  constructor(private profileColorService: ProfileColorService) {
      addIcons({ sendSharp , cameraOutline , send })
      effect(() => {
        this.COLOR = this.profileColorService.profileColor();
      });
  }

  get defaultImage(): string {
    return CONSTANTS.DEFAULT_URL_AVATAR;
  }

  get avatarSize(): string {
    const sizes = {
      small: '60px',
      medium: '100px',
      large: '120px',
    };
    return sizes[this.size] || sizes.medium;
  }

  onEditClick(): void {
    if (!this.disabled) {
      this.changeImage.emit();
    }
  }

   
}

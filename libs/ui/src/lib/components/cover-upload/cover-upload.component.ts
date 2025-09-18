import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon, IonText, IonModal } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cloudUploadOutline, imageOutline } from 'ionicons/icons';
import { Filesystem } from '@capacitor/filesystem';

@Component({
  selector: 'app-cover-upload',
  templateUrl: './cover-upload.component.html',
  styleUrls: ['./cover-upload.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, IonText, IonModal],
})
export class CoverUploadComponent {
  @Output() imageSelected = new EventEmitter<File>();
  @Output() clickEvent = new EventEmitter<void>();
  @Input() onlyEmiitOnSelect = false;

  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor() {
    addIcons({ cloudUploadOutline, imageOutline });
    console.log(this.onlyEmiitOnSelect);
  }

  onFileChange(event: Event): void {
    console.log(this.onlyEmiitOnSelect);
    if (this.onlyEmiitOnSelect) {
      this.clickEvent.emit();
      console.log('jkjkj');
      return;
    }
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      this.createPreview();
      this.imageSelected.emit(this.selectedFile);
    }
  }

  private createPreview(): void {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
}

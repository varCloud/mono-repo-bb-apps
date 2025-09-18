import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cloudUploadOutline } from 'ionicons/icons';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon],
})
export class UploadFileComponent {
  @Input() label: string = 'Cargar archivo';
  @Input() accept: string = '*/*';
  @Input() fileId: string = 'file-upload';
  @Input() icon: string = 'cloud-upload-outline';
  @Output() fileSelected = new EventEmitter<File>();

  selectedFile: File | null = null;

  constructor() {
    addIcons({ cloudUploadOutline });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      this.fileSelected.emit(this.selectedFile);
    }
  }

  getFileName(): string {
    return this.selectedFile ? this.selectedFile.name : this.label;
  }
}

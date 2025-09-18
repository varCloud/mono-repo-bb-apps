import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButton,
  IonIcon,
  IonChip,
  IonProgressBar,
  ToastController,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { BlockUIModule } from 'ng-block-ui';
import { documentAttachOutline, closeCircleOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    BlockUIModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonBackButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonButton,
    IonIcon,
    IonChip,
    IonProgressBar,
  ],
})
export class DocumentComponent implements OnInit {
  documentForm: FormGroup;
  uploadProgress = 0;
  isUploading = false;
  selectedFiles: File[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastController: ToastController,
  ) {
    addIcons({ documentAttachOutline, closeCircleOutline });

    this.documentForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      files: [[], [Validators.required]],
    });
  }

  ngOnInit() {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      for (let i = 0; i < input.files.length; i++) {
        this.selectedFiles.push(input.files[i]);
      }
      this.documentForm.patchValue({ files: this.selectedFiles });
      this.documentForm.get('files')?.markAsDirty();
    }
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
    this.documentForm.patchValue({ files: this.selectedFiles });
    if (this.selectedFiles.length === 0) {
      this.documentForm.get('files')?.markAsTouched();
    }
  }

  async uploadDocuments() {
    if (this.documentForm.invalid) {
      this.markFormGroupTouched(this.documentForm);
      return;
    }

    this.isUploading = true;

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      this.uploadProgress += 0.1;
      if (this.uploadProgress >= 1) {
        clearInterval(progressInterval);
        this.uploadComplete();
      }
    }, 300);
  }

  private uploadComplete() {
    this.isUploading = false;
    this.uploadProgress = 0;
    this.presentToast('Documentos subidos exitosamente');
    this.router.navigate(['/workout']);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }

  cancel() {
    this.router.navigate(['/workout/create']);
  }
}

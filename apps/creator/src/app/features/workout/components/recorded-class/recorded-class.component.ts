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
  IonProgressBar,
  ToastController,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { BlockUIModule } from 'ng-block-ui';

@Component({
  selector: 'app-recorded-class',
  templateUrl: './recorded-class.component.html',
  styleUrls: ['./recorded-class.component.scss'],
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
    IonProgressBar,
  ],
})
export class RecordedClassComponent implements OnInit {
  classForm: FormGroup;
  uploadProgress = 0;
  isUploading = false;
  selectedFile: File | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastController: ToastController,
  ) {
    this.classForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      duration: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      videoFile: [null, [Validators.required]],
    });
  }

  ngOnInit() {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      this.classForm.patchValue({ videoFile: this.selectedFile });
      this.classForm.get('videoFile')?.markAsDirty();
    }
  }

  async uploadVideo() {
    if (this.classForm.invalid) {
      this.markFormGroupTouched(this.classForm);
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
    this.presentToast('Video subido exitosamente');
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

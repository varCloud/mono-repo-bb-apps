import {
  Component,
  Output,
  EventEmitter,
  Input,
  OnDestroy,
  AfterViewInit,
  input,
  effect,
  signal,
  output,
  model,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  IonButton,
  IonInput,
  IonTextarea,
  IonAccordionGroup,
  IonAccordion,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';
import { environment, Exercise } from '@monorepo-bb-app/shared';
import Uppy from '@uppy/core';
import Dashboard from '@uppy/dashboard';

import AwsS3Multipart from '@uppy/aws-s3-multipart';
import Spanish from '@uppy/locales/lib/es_ES';
import { ErrorMessageComponent } from '@monorepo-bb-app/ui';
import { SesionService } from '@monorepo-bb-app/core';
import { DashedAreaComponent } from '@monorepo-bb-app/ui';

@Component({
  selector: 'app-add-exercise',
  templateUrl: './add-exercise.component.html',
  styleUrls: ['./add-exercise.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonInput,
    IonTextarea,
    IonAccordionGroup,
    IonAccordion,
    IonItem,
    IonLabel,
    DashedAreaComponent,
    ErrorMessageComponent,
  ],
})
export class AddExerciseComponent implements AfterViewInit, OnDestroy {
  @Input() exerciseNumber: number = 1;
  @Output() exerciseAdded = new EventEmitter<Exercise>();
  exerciseForm = input.required<FormGroup>();
  hideCoverUpload = signal(false);
  ejecutar = input.required<boolean>();
  objectId = input.required<string>();
  isUploadError = signal(false);
  uploadErrorEvent = output<string | undefined>();
  uploadSuccessEvent = output<void>();

  private uppy!: Uppy;

  private readonly BASE_URL = `${environment.API_URL}/upload`;

  constructor(private sesionService: SesionService) {}

  ngAfterViewInit() {
    this.initializeUppy();
    this.subscribeActions();
  }

  ngOnDestroy() {
    if (this.uppy && typeof this.uppy.close === 'function') {
      this.uppy.close();
    }
  }

  private initializeUppy() {
    Spanish.strings.browseFiles = 'Seleccionar archivos';
    Spanish.strings.dropPasteFiles = ' %{browseFiles} ';
    this.uppy = new Uppy({
      locale: { ...Spanish },
      restrictions: {
        maxFileSize: environment.MAX_SIZE_FILE_AWS_S3,
        maxNumberOfFiles: 1,
        minNumberOfFiles: 1,
        allowedFileTypes: ['video/*'],
      },
      autoProceed: false,
      meta: { idempotency: this.objectId() },
    })
      .use(Dashboard, {
        inline: true,
        target: `#uppy-dashboard${this.exerciseNumber}`,
        showProgressDetails: true,
        proudlyDisplayPoweredByUppy: false,
        height: 270,
        width: '100%',
      })
      .use(AwsS3Multipart, {
        companionUrl: `${this.BASE_URL}/${this.sesionService.user$()?.userId}`,
        retryDelays: [0, 1000, 3000, 5000],
      });

    this.eventListener();
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  public abrirExplorer() {
    const dashboardEl = document.querySelector(
      `#uppy-dashboard${this.exerciseNumber}`
    );
    const fileInput = dashboardEl?.querySelector('.uppy-Dashboard-input');
    if (fileInput instanceof HTMLInputElement) {
      fileInput.click();
    }
  }

  private eventListener() {
    this.uppy.on('upload-success', (file, response) => {
      const videoUrl = response?.uploadURL || '';
      this.exerciseForm().patchValue({
        videoFile: file,
        videoUrl: videoUrl,
      });
      this.exerciseForm().patchValue({
        uppyFileId: null,
        uploadStatus: 'success',
      });
      this.uploadSuccessEvent.emit();
      this.isUploadError.set(false);
    });

    this.uppy.on('upload-error', (file, error, response) => {
      this.isUploadError.set(true);
      this.exerciseForm().patchValue({
        uppyFileId: file?.id,
        uploadStatus: 'error',
      });
      this.uploadErrorEvent.emit(file?.id);
    });

    this.uppy.on('file-added', (file) => {
      this.hideCoverUpload.set(true);
    });

    this.uppy.on('cancel-all', () => {
      this.hideCoverUpload.set(false);
    });
  }

  private subscribeActions() {
    this.exerciseForm()
      .get('retryUpload')
      ?.valueChanges.subscribe((retry: boolean) => {
        if (retry) {
          const uppyFileId = this.exerciseForm().get('uppyFileId')?.value;
          if (uppyFileId) {
            this.uppy.retryUpload(uppyFileId);
          }
        }
      });

    this.exerciseForm()
      .get('upload')
      ?.valueChanges.subscribe((upload: boolean) => {
        if (upload) {
          this.uppy.upload();
        }
      });
  }
}

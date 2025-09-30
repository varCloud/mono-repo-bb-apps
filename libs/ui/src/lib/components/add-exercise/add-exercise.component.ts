import {
  Component,
  Input,
  OnDestroy,
  AfterViewInit,
  input,
  signal,
  output,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  IonInput,
  IonTextarea,
  IonAccordionGroup,
  IonAccordion,
  IonItem,
  IonLabel,
  IonIcon,
} from '@ionic/angular/standalone';
import {
  environment,
  ExerciseFormControls,
  StatusUpload,
} from '@monorepo-bb-app/shared';
import Uppy from '@uppy/core';
import Dashboard from '@uppy/dashboard';

import AwsS3Multipart from '@uppy/aws-s3-multipart';
import Spanish from '@uppy/locales/lib/es_ES';
import {
  ErrorMessageComponent,
  DashedAreaComponent,
} from '@monorepo-bb-app/ui';
import { SesionService } from '@monorepo-bb-app/core';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-add-exercise',
  templateUrl: './add-exercise.component.html',
  styleUrls: ['./add-exercise.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
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
  @Input() exerciseNumber = 1;
  @Input() isDocument = true;
  @Input() showDescription = true;
  @Input() showIconDelete = false;

  @ViewChild('uppyDashboard', { static: false }) uppyDashboard:
    | ElementRef
    | undefined;

  deleteEvent = output<Uppy>();
  exerciseForm = input.required<FormGroup<ExerciseFormControls>>();
  hideCoverUpload = signal(false);
  ejecutar = input.required<boolean>();
  objectId = input.required<string>();
  isUploadError = signal(false);
  uploadErrorEvent = output<string | undefined>();
  uploadSuccessEvent = output<void>();

  private uppy!: Uppy;

  private readonly BASE_URL = `${environment.API_URL}/upload`;

  constructor(private sesionService: SesionService) {
    addIcons({ trashOutline });
  }

  ngAfterViewInit() {
    this.initializeUppy();
    this.subscribeActions();
  }

  ngOnDestroy() {}

  removeExercise($event?: Event) {
    $event?.stopPropagation();
    this.deleteEvent.emit(this.uppy);
  }

  private initializeUppy() {
    Spanish.strings.browseFiles = 'Seleccionar archivos';
    Spanish.strings.dropPasteFiles = ' %{browseFiles} ';
    this.uppy = new Uppy({
      id: `uppy-${this.exerciseNumber}`,
      locale: { ...Spanish },
      restrictions: {
        maxFileSize: environment.MAX_SIZE_FILE_AWS_S3,
        maxNumberOfFiles: 1,
        minNumberOfFiles: 1,
        allowedFileTypes: [this.isDocument ? 'application/pdf' : 'video/*'],
      },
      autoProceed: false,
      meta: { idempotency: this.objectId() },
    })
      .use(Dashboard, {
        inline: true,
        target: this.uppyDashboard?.nativeElement,
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
        file: file,
        url: videoUrl,
      });
      this.exerciseForm().patchValue({
        uploadStatus: StatusUpload.SUCCESS,
      });
      this.uploadSuccessEvent.emit();
      this.isUploadError.set(false);
    });

    this.uppy.on('upload-error', (file, error, response) => {
      this.isUploadError.set(true);
      this.exerciseForm().patchValue({
        uppyFileId: file?.id,
        uploadStatus: StatusUpload.ERROR,
      });
      this.uploadErrorEvent.emit(file?.id);
    });

    this.uppy.on('file-added', (file) => {
      this.hideCoverUpload.set(true);
      this.exerciseForm().patchValue({
        uppyFileId: file?.id,
      });
    });

    this.uppy.on('cancel-all', () => {
      this.hideCoverUpload.set(false);
      this.exerciseForm().patchValue({
        uppyFileId: null,
      });
    });
    this.uppy.on('file-removed', () => {
      this.hideCoverUpload.set(false);
      this.exerciseForm().patchValue({
        uppyFileId: null,
      });
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

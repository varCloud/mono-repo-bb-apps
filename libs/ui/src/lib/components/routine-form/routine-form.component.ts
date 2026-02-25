import { Component, input, signal, type OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import {
  IonCol,
  IonInput,
  IonButton,
  IonProgressBar,
  IonTextarea,
  IonText
} from '@ionic/angular/standalone';
import {
  LoaderUIService,
  SesionService,
  UploadService,
} from '@monorepo-bb-app/core';
import {
  Tag,
  LocationType,
  DifficultyLevel,
  Categorie,
  CatalogType,
  ToastService,
  ExerciseFormControls,
  StatusUpload,
  convertToPayload,
  WorkoutService,
  destroyUppy,
  urlValidator,
  CompleteResultUpload,
  proceessUploadPhoto,
} from '@monorepo-bb-app/shared';
import { UppyFile } from '@uppy/utils';
import { finalize } from 'rxjs';

import ObjectID from 'bson-objectid';
import { addIcons } from 'ionicons';
import {
  addCircleOutline,
  addOutline,
  createOutline,
  trashOutline,
} from 'ionicons/icons';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { AvatarPickerComponent } from '../avatar-picker/avatar-picker.component';
import { CatalogSelectComponent } from '../catalog-select/catalog-select.component';
import { AddExerciseComponent } from '../add-exercise/add-exercise.component';
import { AddRecordedClassComponent } from '../add-recorded-class/add-recorded-class.component';
import { DashedAreaComponent } from '../dashed-area/dashed-area.component';
import { TrainingTypeEnum } from '../../../../../shared/constants/types-routines';
import Uppy from '@uppy/core';
import { BUCKET_TYPE } from 'libs/shared/constants/enums';


@Component({
  selector: 'lib-routine-form',
  imports: [
    IonProgressBar,
    IonButton,
    IonInput,
    IonCol,
    TranslateModule,
    ErrorMessageComponent,
    AvatarPickerComponent,
    CatalogSelectComponent,
    AddExerciseComponent,
    DashedAreaComponent,
    ReactiveFormsModule,
    AddRecordedClassComponent,
    IonTextarea,
    IonText
  ],
  templateUrl: './routine-form.component.html',
  styleUrl: './routine-form.component.scss',
})
export class RoutineFormComponent implements OnInit {
  typeRoutine = input.required<TrainingTypeEnum>();

  uploadProgress = 0;
  isUploading = false;
  nextExerciseId = 0;

  targetOptions: Tag[] = [];
  locationOptions: LocationType[] = [];
  difficultyOptions: DifficultyLevel[] = [];
  categoryOptions: Categorie[] = [];
  ejecutarFILE = signal(false);
  objectId = new ObjectID().toHexString();

  retryUpload = signal(false);
  retryOnlyForm = signal(false);
  CATALOG_TYPE = CatalogType;
  TRAINING_TYPES = TrainingTypeEnum;

  titleSectionByType = {
    [TrainingTypeEnum.ROUTINES]: 'workout.routine.exercises-title',
    [TrainingTypeEnum.RECORDED_CLASSES]:
      'workout.routine.exercises-video-title',
    [TrainingTypeEnum.DOCUMENT]: 'workout.routine.exercises-doc-title',
  };

  routineForm = this.formBuilder.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    coverImage: [null, Validators.required],
    target: [''],
    location: [''],
    difficulty: [''],
    category: [''],
    equipment: [''],
    titleVideo: [''],
    urlVideo: [''],
    exercises: this.formBuilder.array<ExerciseFormControls>([]),
  });

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private _loader: LoaderUIService,
    public _sesionService: SesionService,
    private _uploadService: UploadService,
    private _workoutService: WorkoutService,
    private _toastService: ToastService,
    private _translate: TranslateService
  ) {
    addIcons({ addCircleOutline, trashOutline, createOutline, addOutline });
  }

  ngOnInit() {
    if (
      this.typeRoutine() === TrainingTypeEnum.ROUTINES ||
      this.typeRoutine() === TrainingTypeEnum.DOCUMENT
    ) {
      this.toggleAddExercise();
    }

    this.setValidators();
  }

  get exercises() {
    return this.routineForm.get('exercises') as FormArray;
  }

  setValidators() {
    if (
      this.typeRoutine() === TrainingTypeEnum.ROUTINES ||
      this.typeRoutine() === TrainingTypeEnum.RECORDED_CLASSES
    ) {
      this.routineForm.get('target')?.setValidators([Validators.required]);
      this.routineForm.get('location')?.setValidators([Validators.required]);
      this.routineForm.get('difficulty')?.setValidators([Validators.required]);
      this.routineForm.get('category')?.setValidators([Validators.required]);
    }

    if (this.typeRoutine() === TrainingTypeEnum.RECORDED_CLASSES) {
      this.routineForm.get('titleVideo')?.setValidators([Validators.required]);
      this.routineForm
        .get('urlVideo')
        ?.setValidators([Validators.required, urlValidator]);
    }
  }

  async onCoverImageSelected(file: Photo) {
    this.routineForm.patchValue({ coverImage: file as any });
  }

  toggleAddExercise() {
    this.nextExerciseId += 1;
    const emptyExercise = this.formBuilder.group<ExerciseFormControls>({
      id: new FormControl<number>(this.nextExerciseId, { nonNullable: true }),
      name: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      description: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      file: new FormControl<UppyFile | null>(null),
      url: new FormControl('', { nonNullable: true }),
      s3Key: new FormControl('', { nonNullable: true }),
      uppyFileId: new FormControl<string | null>(null, {
        validators: [Validators.required],
      }),
      retryUpload: new FormControl<boolean>(false, { nonNullable: true }),
      upload: new FormControl(false, { nonNullable: true }),
      uploadStatus: new FormControl<StatusUpload>(StatusUpload.PENDING, {
        nonNullable: true,
      }),
      duration: new FormControl<number>(0, { nonNullable: true }),
    });

    if (this.typeRoutine() === TrainingTypeEnum.DOCUMENT) {
      emptyExercise.get('description')?.clearValidators();
    }
    this.exercises.push(emptyExercise);
  }

  removeExercise(uppy: Uppy, id: number) {
    this.exercises.removeAt(id);
    destroyUppy(uppy);
  }

  getFileName(index: number): string {
    const videoFile = this.exercises.at(index).get('videoFile')?.value;
    return videoFile ? videoFile.name : 'Seleccionar video';
  }

  cancel() {
    this.router.navigate(['/workout/create']);
  }

  saveRoutine() {
    if (this.routineForm.invalid) {
      this.routineForm.markAllAsTouched();
      return;
    }

    if (this.typeRoutine() === TrainingTypeEnum.RECORDED_CLASSES) {
      this.saveExerciseData();
      return;
    }

    if (this.retryOnlyForm()) {
      this.saveExerciseData();
      this.retryOnlyForm.set(false);
    }
    this._loader.showLoader();
    const exercises = this.routineForm.get('exercises') as FormArray;
    if (this.retryUpload()) {
      this.checkRetryUpload();
    }
    exercises.controls.forEach((exercise) => {
      if (!exercise.get('upload')?.value) {
        exercise.patchValue({ upload: true });
      }
    });
  }

  get areValidExercises(): boolean {
    const exercises = this.routineForm.get('exercises') as FormArray;
    if (exercises?.value.length === 0) {
      return false;
    }

    const hasVideo = exercises?.value.every((ex: any) => ex.uppyFileId);
    if (exercises?.value.length > 0 && !hasVideo) {
      return false;
    }
    return exercises?.valid ?? false;
  }

  public successUpload() {
    if (this.routineForm.invalid) return;

    const updatedExercises = this.routineForm.get('exercises')?.value ?? [];

    const allUploaded = updatedExercises.every(
      (ex: any) => ex.url && ex.url.length > 0
    );
    if (!allUploaded) {
      return;
    }

    this.saveExerciseData();
  }

  public onExerciseUploadError() {
    this.retryUpload.set(true);
    const allUploaded = this.checkAllExercisesProcessed();
    if (allUploaded) {
      this._loader.hideLoader();
    }
  }

  public checkRetryUpload() {
    const exercises = this.routineForm.get('exercises') as FormArray;
    exercises.controls.forEach((exercise) => {
      if (exercise.get('uploadStatus')?.value === StatusUpload.ERROR) {
        exercise.patchValue({
          retryUpload: true,
          uploadStatus: StatusUpload.PENDING,
        });
      }
      setTimeout(() => {
        exercise.patchValue({ retryUpload: false });
      }, 1000);
    });
  }

  private checkAllExercisesProcessed(): boolean {
    const exercises = this.routineForm.get('exercises') as FormArray;
    return exercises.controls.every(
      (exercise) => exercise.get('uploadStatus')?.value !== StatusUpload.PENDING
    );
  }

  private async saveExerciseData() {
    this._loader.showLoader();
    let imageUrl = ''
    const dataPhoto = this.routineForm.get('coverImage')?.value;
    if (dataPhoto) {
      const img = await this.uploadPhoto(dataPhoto);
      imageUrl = img?.location || '';
    }

    const payload = convertToPayload({
      ...this.routineForm.value,
      creatorId: this._sesionService.user$()?.userId,
      workoutUrl: imageUrl,
      idempotencyKey: this.objectId,
      workoutTypeId: this.typeRoutine(),
    });

    this._workoutService
      .createWorkout(payload)
      .pipe(finalize(() => this._loader.hideLoader()))
      .subscribe({
        next: (res) => {
          this.router.navigate(['/home/training']);
          this._toastService.success(
            this._translate.instant('workout.routine.created-success'),
            {
              duration: 3000,
            }
          );
        },
        error: (err) => {
          this.retryOnlyForm.set(true);
          this._toastService.error(
            this._translate.instant('workout.routine.error'),
            {
              duration: 2000,
            }
          );
        },
      });
  }

  private async uploadPhoto(image: Photo): Promise<CompleteResultUpload> {
    try {
      const dataPhoto = await proceessUploadPhoto(image);
      const result: CompleteResultUpload = await this._uploadService.uploadFile(
        dataPhoto.fileData,
        dataPhoto.fileName,
        dataPhoto.fileType,
        BUCKET_TYPE.PUBLIC
      );

      return result;
    } catch (error) {
      console.error('Error in uploadPhoto:', error);
      throw error;
    }
  }
}

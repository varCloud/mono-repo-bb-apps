import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  NgSelectOption,
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
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButton,
  IonIcon,
  IonProgressBar,
  IonList,
  IonItemSliding,
  IonItemOption,
  IonItemOptions,
  IonFab,
  IonFabButton,
  ToastController,
  IonChip,
  IonSelect,
  IonSelectOption,
  IonCol,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { BlockUIModule } from 'ng-block-ui';
import {
  addCircleOutline,
  trashOutline,
  createOutline,
  addOutline,
} from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { UploadFileComponent, CoverUploadComponent, AddExerciseComponent } from '@monorepo-bb-app/ui';
import { Exercise, CatalogsService, CatalogType, Tag, LocationType, DifficultyLevel, Categorie, StatusUpload, convertToPayload, CompleteResultUpload } from '@monorepo-bb-app/shared';
import ObjectID from 'bson-objectid';
import { DashedAreaComponent, AvatarPickerComponent } from '@monorepo-bb-app/ui';
import { LoaderUIService, SesionService, UploadService } from '@monorepo-bb-app/core';
import { Photo } from '@capacitor/camera';
import { WorkoutService } from '../../service/workout.service';
import { finalize } from 'rxjs';
import { ToastService } from '@monorepo-bb-app/shared';

interface ExerciseStep {
  id: number;
  name: string;
  description: string;
  videoFile: File | null;
}

@Component({
  selector: 'app-routine',
  templateUrl: './routine.component.html',
  styleUrls: ['./routine.component.scss'],
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
    IonCardHeader,
    IonCardTitle,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonButton,
    IonIcon,
    IonProgressBar,
    IonList,
    IonItemSliding,
    IonItemOption,
    IonItemOptions,
    IonFab,
    IonFabButton,
    IonChip,
    IonSelect,
    IonSelectOption,
    UploadFileComponent,
    CoverUploadComponent,
    AddExerciseComponent,
    IonCol,
    DashedAreaComponent,
    AvatarPickerComponent,
  ],
})
export class RoutineComponent implements OnInit {
  routineForm: FormGroup;
  uploadProgress = 0;
  isUploading = false;
  nextExerciseId = 1;

  targetOptions: Tag[] = [];
  locationOptions: LocationType[] = [];
  difficultyOptions: DifficultyLevel[] = [];
  categoryOptions: Categorie[] = [];
  ejecutarFILE = signal(false);
  objectId = new ObjectID().toHexString();

  retryUpload = signal(false);
  retryOnlyForm = signal(false);

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private _catalogService: CatalogsService,
    private _loader: LoaderUIService,
    public _sesionService: SesionService,
    private _uploadService: UploadService,
    private _workoutService: WorkoutService,
    private toastService: ToastService,
  ) {
    addIcons({ addCircleOutline, trashOutline, createOutline, addOutline });

    this.routineForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      coverImage: [null],
      target: ['', [Validators.required]],
      location: ['', [Validators.required]],
      difficulty: ['', [Validators.required]],
      category: ['', [Validators.required]],
      equipment: [''],
      exercises: this.formBuilder.array([]),
    });
  }

  ngOnInit() {
    this._getTargets();
    this._getLocationTypes();
    this._getDifficultyLevels();
    this._getCategories();
    this.toggleAddExercise();
  }

  get exercises() {
    return this.routineForm.get('exercises') as FormArray;
  }

  async onCoverImageSelected(file: Photo) {
    this.routineForm.patchValue({ coverImage: file });
  }

  onExerciseAdded(exercise: Exercise) {
    const lastExercise = this.exercises.at(this.exercises.length - 1);
    lastExercise.patchValue({
      id: this.nextExerciseId++,
      name: exercise.name,
      description: exercise.description,
      videoFile: exercise.videoFile,
    });
  }

  toggleAddExercise() {
    const emptyExercise = this.formBuilder.group({
      id: [this.nextExerciseId],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      videoFile: [null],
      videoUrl: [''],
      uppyFileId: [null],

      retryUpload: [null],
      upload: [false],
      uploadStatus: [StatusUpload.PENDING],
    });
    this.exercises.push(emptyExercise);
  }

  removeExercise(index: number) {
    this.exercises.removeAt(index);
  }

  getFileName(index: number): string {
    const videoFile = this.exercises.at(index).get('videoFile')?.value;
    return videoFile ? videoFile.name : 'Seleccionar video';
  }

  cancel() {
    this.router.navigate(['/workout/create']);
  }

  private _getTargets() {
    this._catalogService
      .getCatalog<Tag[]>(CatalogType.TAGS)
      .subscribe((data: Tag[]) => {
        this.targetOptions = data;
      });
  }

  private _getLocationTypes() {
    this._catalogService
      .getCatalog<LocationType[]>(CatalogType.LOCATION_TYPES)
      .subscribe((data: LocationType[]) => {
        this.locationOptions = data;
      });
  }

  private _getDifficultyLevels() {
    this._catalogService
      .getCatalog<DifficultyLevel[]>(CatalogType.DIFFICULTY_LEVELS)
      .subscribe((data: DifficultyLevel[]) => {
        this.difficultyOptions = data;
      });
  }

  private _getCategories() {
    this._catalogService
      .getCatalog<Categorie[]>(CatalogType.CATEGORIES)
      .subscribe((data: Categorie[]) => {
        this.categoryOptions = data;
      });
  }

  saveRoutine() {
    if (this.routineForm.invalid) {
      this.routineForm.markAllAsTouched();
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
    if (this.routineForm.get('exercises')?.value.length === 0) {
      return false;
    }
    return this.routineForm.get('exercises')?.invalid ?? true;
  }

  public successUpload() {
    if (this.routineForm.invalid) return;

    const updatedExercises = this.routineForm.get('exercises')?.value;

    const allUploaded = updatedExercises.every(
      (ex: any) => ex.videoUrl && ex.videoUrl.length > 0,
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
      (exercise) =>
        exercise.get('uploadStatus')?.value !== StatusUpload.PENDING,
    );
  }

  private async saveExerciseData() {
    let imageUrl = '';
    try {
      const file = this.routineForm.get('coverImage')?.value as Photo;
      const img = await this._uploadService.uploadPhoto(file);
      imageUrl = img?.location || '';
    } catch (error) {
      console.error('Error uploading image:', error);
    }
    const payload = convertToPayload({
      ...this.routineForm.value,
      creatorId: this._sesionService.user$()?.userId,
      workoutUrl: imageUrl,
    });

    this._workoutService
      .createWorkout(payload)
      .pipe(finalize(() => this._loader.hideLoader()))
      .subscribe({
        next: (res) => {
          console.log('Workout routine saved successfully');
          // this.router.navigate(['/workout']);
        },
        error: (err) => {
          this.retryOnlyForm.set(true);
          this.toastService.error('Error saving workout routine', {
            duration: 2000,
          });
        },
      });
  }
}

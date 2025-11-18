import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonChip,
  IonLabel,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heart, heartOutline, share, download } from 'ionicons/icons';
import { CustomVideoPlayerComponent } from '@monorepo-bb-app/ui';
import {
  WorkoutDetailModel,
  WorkoutService,
  ToastService,
} from '@monorepo-bb-app/shared';
import { LoaderUIService } from '@monorepo-bb-app/core';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.page.html',
  styleUrls: ['./video-player.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonChip,
    IonLabel,
    IonSpinner,
    CustomVideoPlayerComponent,
  ],
})
export class VideoPlayerPage implements OnInit {
  workout = signal<WorkoutDetailModel | null>(null);
  isLoading = signal(true);
  hasError = signal(false);
  isLiked = signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private workoutService: WorkoutService,
    private toastService: ToastService,
    private loaderService: LoaderUIService
  ) {
    addIcons({ heart, heartOutline, share, download });
  }

  ngOnInit() {
    const workoutId = this.route.snapshot.paramMap.get('id');
    if (workoutId) {
      this.loadWorkout(parseInt(workoutId, 10));
    } else {
      this.hasError.set(true);
      this.isLoading.set(false);
    }
  }

  private async loadWorkout(workoutId: number) {
    try {
      this.isLoading.set(true);
      this.hasError.set(false);
      this.loaderService.showLoader();

      const workout = await this.workoutService.getWorkoutById(workoutId);
      console.log('workout', workout);
      this.workout.set(workout);
    } catch (error) {
      console.error('Error loading workout:', error);
      this.hasError.set(true);
      this.toastService.error('Error al cargar el entrenamiento', {
        duration: 3000,
      });
    } finally {
      this.isLoading.set(false);
      this.loaderService.hideLoader();
    }
  }

  onVideoPlay() {
    console.log('Video started playing');
  }

  onVideoPause() {
    console.log('Video paused');
  }

  onVideoEnded() {
    console.log('Video ended');
    this.toastService.success('¡Entrenamiento completado!', {
      duration: 2000,
    });
  }

  onTimeUpdate(time: number) {
    // Aquí puedes guardar el progreso del video
    // console.log('Current time:', time);
  }

  toggleLike() {
    this.isLiked.update((current) => !current);
    // Aquí implementarías la lógica para guardar el like en el backend
    const message = this.isLiked()
      ? '¡Te gusta este entrenamiento!'
      : 'Like removido';
    this.toastService.success(message, { duration: 1500 });
  }

  async shareWorkout() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: this.workout()?.title,
          text: this.workout()?.description,
          url: window.location.href,
        });
      } else {
        // Fallback: copiar al portapapeles
        await navigator.clipboard.writeText(window.location.href);
        this.toastService.success('Enlace copiado al portapapeles', {
          duration: 2000,
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }

  goBack() {
    this.router.navigate(['/training']);
  }

  getCategoryNames(): string {
    return (
      this.workout()
        ?.categories.map((cat) => cat.description)
        .join(', ') || 'Sin categoría'
    );
  }

  getDifficultyNames(): string {
    return (
      this.workout()
        ?.difficultyLevels.map((level) => level.description)
        .join(', ') || 'Sin nivel'
    );
  }
}


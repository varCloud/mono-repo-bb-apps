import { Component, OnInit, signal } from '@angular/core';
import { addIcons } from 'ionicons';
import {
  barbell,
  bookmark,
  heart,
  search,
  notifications,
  filterCircleOutline,
} from 'ionicons/icons';
import {
  IonIcon,
  IonButton,
  IonContent,
  IonHeader,
  IonGrid,
  IonCol,
  IonRow,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  ModalController,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { CardListComponent, FilterComponent } from '@monorepo-bb-app/ui';
import {
  Paginator,
  ToastService,
  WorkoutListModel,
  WorkoutService,
} from '@monorepo-bb-app/shared';
import { LoaderUIService } from '@monorepo-bb-app/core';
import { MODAL_RESPONSE } from 'libs/shared/constants/enums';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    IonInfiniteScrollContent,
    IonInfiniteScroll,
    IonRow,
    IonCol,
    IonGrid,
    IonButton,
    IonIcon,
    IonContent,
    IonHeader,
    CardListComponent,
  ],
})
export class HomeComponent implements OnInit {
  workouts = signal<WorkoutListModel[]>([]);
  paginator = signal<Paginator>({} as Paginator);
  constructor(
    private router: Router,
    private _workoutService: WorkoutService,
    private _loader: LoaderUIService,
    private _toastService: ToastService,
    private modalCtrl: ModalController
  ) {
    addIcons({
      barbell,
      heart,
      bookmark,
      search,
      notifications,
      filterCircleOutline,
    });
  }

  ngOnInit(): void {
    this.getWorkouts();
  }

  private async getWorkouts(url?: string, params = {}) {
    this._loader.showLoader();
    try {
      const res = await this._workoutService.getWorkouts(url, params);
      this.workouts.update((current) => [...current, ...res.data]);
      this.paginator.set(res.paginator);
      console.log(res);
    } catch (error) {
      this._toastService.error('Error al cargar los entrenamientos', {
        duration: 3000,
      });
    } finally {
      this._loader.hideLoader();
    }
    // this._workoutService
    //   .getWorkouts(url)
    //   .pipe(finalize(() => this._loader.hideLoader()))
    //   .subscribe({
    //     next: (res) => {
    //       this.workouts.update((current) => [...current, ...res.data]);
    //       this.paginator.set(res.paginator);
    //       console.log(res);
    //     },
    //     error: (err) => {},
    //   });
  }

  onNewWorkoutClick() {
    this.router.navigate(['home/workouts']);
  }

  async onIonInfinite(event: any) {
    if (this.paginator().links.next) {
      await this.getWorkouts(this.paginator().links.next as string);
      event.target.complete();
      event.target.disabled = !this.paginator().links.next;
    }
  }

  public async openFilter() {
    const modal = await this.modalCtrl.create({
      component: FilterComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === MODAL_RESPONSE.CONFIRM) {
      await this.getWorkouts(undefined, data);
    }
  }
}

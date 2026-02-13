
import { addIcons } from 'ionicons';
import { Component, OnInit, Input, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ConversationListComponent } from '../conversation-list/conversation-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { arrowBackOutline, chevronBackOutline, send, sendSharp, search } from 'ionicons/icons';
import { UserConversationService } from 'libs/core/services/user-conversation/user-conversation.services';
import { LoaderUIService } from 'libs/core/services/loader-ui.service';
import { finalize } from 'rxjs';
import { UserConversationModel } from 'libs/shared/models/user-conversation';
import { PaginatorModel } from 'libs/shared/models/paginator';
import { ModalHeaderSearchbarComponent } from '../modal-header-searchbar/modal-header-searchbar.component';
import { WorkoutListModel } from 'libs/shared/models/workout-response-list';
import { WorkoutService } from 'libs/shared/services/workout/workout.service';
import { ToastService } from 'libs/shared/services/toast.service';
import { CardListComponent } from '../card-list/card-list.component';
import { SesionService } from 'libs/core/services/sesion.service';
import { ActionsWorkoutService } from 'libs/core/services/actions-workout.service';
import { User ,UserModel } from '@monorepo-bb-app/shared';
import { Router } from '@angular/router';
import { ENUM_TYPE_USER } from 'libs/shared/constants/enums';


@Component({
  selector: 'app-creator-search-workout-modal',
  templateUrl: './creator-search-workout-modal.html',
  styleUrls: ['./creator-search-workout-modal.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ConversationListComponent,
    TranslateModule,
    ModalHeaderSearchbarComponent,
    CardListComponent,
  ],
})
export class CreatorSearchWorkoutModalComponent implements OnInit {
  @Input() data: any; // Aquí recibiremos los datos enviados
  public search: string = '';
  workouts = signal<WorkoutListModel[]>([]);
  favorites = signal<number[]>([]);
  public user = signal<User | null>(null);
  constructor(
    private modalCtrl: ModalController,
    private _loader: LoaderUIService,
    private _workoutService: WorkoutService,
    private _toastService: ToastService,
    private _sesionService: SesionService,
    private _actionsWorkoutService: ActionsWorkoutService,
    private router: Router,

  ) {

    effect(() => {
        this.user.set(this._sesionService.user$());
    })
    addIcons({ sendSharp, arrowBackOutline, chevronBackOutline });
  }

  ngOnInit() {
    this._loader.showLoader();
    this.getWorkouts(undefined, true);
  }

  private async getWorkouts(url?: string, reset = false) {
    this._loader.showLoader();
    try {
      const params = await this.getParams();
      const res = await this._workoutService.getWorkouts(url, params);
      if (reset) {
        this.workouts.set(res.data);
      } else {
        this.workouts.update((current) => [...current, ...res.data]);
      }

    } catch (error) {
      this._toastService.error('Error al cargar los entrenamientos', {
        duration: 3000,
      });
    } finally {
      this._loader.hideLoader();
    }
  }

  private async getParams() {
    if (!this.search) {
      return {};
    }

    let params = { search: this.search };

    return params;
  }

  async clickCard(workout: WorkoutListModel) {
    const user = this.user();
    this.router.navigate(['home/workouts', workout.workoutId, workout.creatorId, user?.userId , {
      userType: ENUM_TYPE_USER.CREATOR
    }]);
    this.modalCtrl.dismiss();
  }

  dismiss(data?: any) {
    this.modalCtrl.dismiss(data);
  }

  onConversationSelected(conversation: any) {
    this.modalCtrl.dismiss({ conversation });
  }

  onSearch(event: Event) {
    const target = event.target as HTMLIonSearchbarElement;
    const query = target.value?.toLowerCase() || '';
    this.search = query;
    this.getWorkouts(undefined, true);
  }
}

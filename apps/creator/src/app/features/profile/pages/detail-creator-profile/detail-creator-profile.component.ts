import { SesionService } from './../../../../../../../../libs/core/services/sesion.service';
import {
  ChangeDetectionStrategy,
  Component,
  signal,
  type OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailCreatorProfileComponent } from '@monorepo-bb-app/ui';

@Component({
  selector: 'app-detail-creator-profile',
  imports: [DetailCreatorProfileComponent],
  templateUrl: './detail-creator-profile.component.html',
  styleUrl: './detail-creator-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailCreatorProfilePageComponent implements OnInit {
  public idCreator = signal<number | null>(null);

  constructor(
    private _routerActivate: ActivatedRoute,
    private _router: Router,
    private _sesionService: SesionService
  ) {}

  ngOnInit(): void {
    const id = this._sesionService.user$().userId
    this.idCreator.set(id ? +id : null);
  }
}

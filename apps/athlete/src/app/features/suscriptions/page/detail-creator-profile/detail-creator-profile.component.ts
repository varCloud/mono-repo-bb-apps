import {
  ChangeDetectionStrategy,
  Component,
  signal,
  type OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProcessSuscriptionService } from '@monorepo-bb-app/shared';
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
    private _router: Router
  ) {}

  ngOnInit(): void {
    const id = this._routerActivate.snapshot.paramMap.get('id');
    this.idCreator.set(id ? +id : null);
  }

  goToSuscriptionCreator() {
    this._router.navigate([
      '/home/suscriptions/suscription-creator',
      this.idCreator(),
    ]);
  }
}

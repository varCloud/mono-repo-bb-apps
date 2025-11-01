import {
  ChangeDetectionStrategy,
  Component,
  input,
  type OnInit,
} from '@angular/core';
import { IonCard, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';

@Component({
  selector: 'lib-card-with-lateral-image',
  imports: [IonCol, IonRow, IonGrid, IonCard],
  templateUrl: './card-with-lateral-image.component.html',
  styleUrl: './card-with-lateral-image.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardWithLateralImageComponent {
  public imageUrl = input.required<string>();
}

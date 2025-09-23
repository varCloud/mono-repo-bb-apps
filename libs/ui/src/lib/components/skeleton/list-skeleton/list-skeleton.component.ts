import { Component, effect, input, OnInit } from '@angular/core';
import {
  IonListHeader,
  IonSkeletonText,
  IonItem,
  IonList,
  IonLabel,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-list-skeleton',
  templateUrl: './list-skeleton.component.html',
  styleUrls: ['./list-skeleton.component.scss'],
  imports: [IonLabel, IonItem, IonSkeletonText],
})
export class ListSkeletonComponent implements OnInit {
  itemRepeat = input<number>(1);
  items: any[] = [];
  constructor() {
    effect(() => {
      this.items = Array.from({ length: this.itemRepeat() });
    });
  }

  ngOnInit() {}
}

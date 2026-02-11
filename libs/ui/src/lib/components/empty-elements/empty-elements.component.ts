import { Component, computed, input, signal, Input } from '@angular/core';
import { CONSTANTS } from '@monorepo-bb-app/shared';

@Component({
  selector: 'lib-empty-elements-component',
  templateUrl: './empty-elements.component.html',
  styleUrls: ['./empty-elements.component.scss'],
  standalone: true,
  imports: [
  ]
})
export class EmptyElementsComponent {

  public imgPath = input<string>(CONSTANTS.EMPTY_ELEMENTS_IMAGE);
  public message = input.required<string>();


  constructor() {
  }

}

import { Component, computed, input, signal, Input } from '@angular/core';


// Importaciones de Ionic


// Importa los íconos



@Component({
  selector: 'lib-empty-elements-component',
  templateUrl: './empty-elements.component.html',
  styleUrls: ['./empty-elements.component.scss'],
  standalone: true,
  imports: [
  ]
})
export class EmptyElementsComponent {

  // 1. Recibe la lista completa de FAQs desde la página
  public imgPath = input.required<string>();
  public message = input.required<string>();


  constructor() {
  }

}

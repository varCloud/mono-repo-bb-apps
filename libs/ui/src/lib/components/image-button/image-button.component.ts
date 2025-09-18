import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-image-button',
  templateUrl: './image-button.component.html',
  styleUrls: ['./image-button.component.scss'],
  standalone: true,
})
export class ImageButtonComponent {
  @Input() image: string = '';
  @Input() alt: string = '';
}

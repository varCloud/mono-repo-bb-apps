import { Component, input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
})
export class HeaderComponent {
  useImg = input<boolean>(true);
  image = input('./assets/images/logo-con-letras.svg');
  text = input();
  subtext = input();
  customClass = input<string>('');
}

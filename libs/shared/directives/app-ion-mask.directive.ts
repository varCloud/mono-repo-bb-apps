import { Directive, Input } from '@angular/core';
import { NgxMaskDirective } from 'ngx-mask';
@Directive({
  // 1. Selector actualizado a [appMask]
  selector: '[appMask]',
  standalone: true,
  hostDirectives: [
    {
      directive: NgxMaskDirective,
      inputs: [
        // 2. Mapeo actualizado: el input [appMask] ahora alimenta a [mask]
        'mask: appMask',
        'prefix',
        'suffix',
        'thousandSeparator',
        'dropSpecialCharacters',
        'showMaskTyped',
        'allowNegativeNumbers',
        'validation',
      ],
    },
  ],
})
// 3. Nombre de la clase actualizado
export class AppMaskDirective {
  // --- Input principal y genérico ---
  // 4. Input principal actualizado
  @Input('appMask') mask: string = '';

  // --- Inputs adicionales que se exponen ---
  @Input() prefix: string = '';
  @Input() suffix: string = '';
  @Input() thousandSeparator: string = '';
  @Input() dropSpecialCharacters: boolean = true;
  @Input() showMaskTyped: boolean = false;
  @Input() allowNegativeNumbers: boolean = false;
  @Input() validation: boolean = false;
}

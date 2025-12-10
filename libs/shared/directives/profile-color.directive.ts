import { ProfileColorService } from './../../core/services/profile-color.service';
import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  effect,
  inject,
  Injector,
} from '@angular/core';

// Nota: El servicio se inyecta dinámicamente para evitar dependencias circulares
// ProfileColorService debe estar disponible en el injector de la aplicación

/**
 * Directiva para aplicar automáticamente el color de perfil del usuario a elementos
 * 
 * Uso:
 * <ion-avatar appProfileColor="border"></ion-avatar>
 * <ion-button appProfileColor="background"></ion-button>
 * <ion-chip appProfileColor="text"></ion-chip>
 * <ion-segment appProfileColor="indicator"></ion-segment>
 */
@Directive({
  selector: '[appProfileColor]',
  standalone: true,
})
export class ProfileColorDirective  {
  /**
   * Tipo de estilo a aplicar:
   * - 'border': aplica border-color
   * - 'background': aplica --background (custom property de Ionic)
   * - 'text': aplica color (para texto)
   * - 'indicator': aplica --indicator-color (para ion-segment)
   * - 'color': aplica --color (custom property de Ionic)
   */
  @Input() appProfileColor:
    | 'border'
    | 'background'
    | 'text'
    | 'indicator'
    | 'color' = 'border';

  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private injector = inject(Injector);
  private colorService: any;

  constructor(private profileColorService: ProfileColorService) {
      effect(() => {
        const color = this.profileColorService.profileColor();
        this.applyColor(color);
      });
  }

  private applyColor(color: string): void {
    const element = this.el.nativeElement;
    switch (this.appProfileColor) {
      case 'border':
        this.renderer.setStyle(element, 'border-color', color);
        break;

      case 'background':
        this.renderer.setStyle(element, '--background', color);
        break;

      case 'text':
        this.renderer.setStyle(element, 'color', color);
        break;

      case 'indicator':
        this.renderer.setStyle(element, '--indicator-color', color);
        break;

      case 'color':
        this.renderer.setStyle(element, '--color', color);
        this.renderer.setStyle(element, 'color', color);
        break;

      default:
        console.warn(
          `ProfileColorDirective: Tipo de estilo no reconocido: ${this.appProfileColor}`
        );
    }
  }
}

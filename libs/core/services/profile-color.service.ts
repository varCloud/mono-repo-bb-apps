import { Injectable, computed } from '@angular/core';
import { SesionService } from './sesion.service';
import { CONSTANTS } from '@monorepo-bb-app/shared';

/**
 * Servicio centralizado para manejar el color de perfil del usuario
 * Se sincroniza automáticamente con los cambios del usuario en sesión
 */
@Injectable({
  providedIn: 'root',
})
export class ProfileColorService {
  private readonly DEFAULT_COLOR = CONSTANTS.USER_DEFAULT_COLOR;

  
  public profileColor = computed(
    () => this._sesionService.user$()?.profileColor || this.DEFAULT_COLOR
  );

  constructor(private _sesionService: SesionService) {}

  /**
   * Retorna un string CSS para aplicar el color al indicador de ion-segment
   * @returns String CSS con la propiedad --indicator-color
   */
  getSegmentStyle(): string {
    return `--indicator-color: ${this.profileColor()}`;
  }


  getDefaultColor(): string {
    return this.DEFAULT_COLOR;
  }


  getStyles(properties: string[]): Record<string, string> {
    const color = this.profileColor();
    return properties.reduce(
      (acc, prop) => ({ ...acc, [prop]: color }),
      {} as Record<string, string>
    );
  }


  getInlineStyles(properties: string[]): string {
    const color = this.profileColor();
    return properties.map((prop) => `${prop}: ${color}`).join('; ');
  }
}

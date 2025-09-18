import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskEmail',
  standalone: true,
})
export class MaskEmailPipe implements PipeTransform {
  transform(
    email: string,
    visibleStart: number = 2,
    visibleEnd: number = 2,
  ): string {
    if (!email || !email.includes('@')) {
      return email;
    }

    const [localPart, domain] = email.split('@');

    // Validar que la parte local tenga suficientes caracteres
    if (localPart.length <= visibleStart + visibleEnd) {
      // Si el email es muy corto, mostrar solo el primer carácter y el dominio
      return `${localPart.charAt(0)}***@${domain}`;
    }

    // Ocultar caracteres de la parte local (antes del @)
    const startChars = localPart.substring(0, visibleStart);
    const endChars = localPart.substring(localPart.length - visibleEnd);
    const hiddenLength = localPart.length - visibleStart - visibleEnd;
    const asterisks = '*'.repeat(Math.min(hiddenLength, 6)); // Máximo 6 asteriscos

    // Manejar el dominio - mostrar solo la parte después del último punto
    const domainParts = domain.split('.');
    const extension = domainParts[domainParts.length - 1];
    const domainName =
      domainParts.length > 1
        ? domainParts[domainParts.length - 2]
        : domainParts[0];

    let maskedDomain: string;
    if (domainName.length > 4) {
      // Para dominios largos, ocultar parte del medio
      maskedDomain = `${domainName.substring(0, 1)}***${domainName.substring(domainName.length - 1)}.${extension}`;
    } else {
      // Para dominios cortos, mostrar completo
      maskedDomain = domain;
    }

    return `${startChars}${asterisks}${endChars}@${maskedDomain}`;
  }
}

import { AbstractControl } from '@angular/forms';
export const urlValidator = (control: AbstractControl) => {
  if (!control.value) return null;

  const value = control.value.trim();

  // Patrón regex simple para URLs
  const urlPattern =
    /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

  if (!urlPattern.test(value)) {
    return { invalidUrl: true };
  }

  return null;
};

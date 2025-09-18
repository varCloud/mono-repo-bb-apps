import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { customMessage } from '../../models/customMessage';

@Injectable({
  providedIn: 'root',
})
export class ErrorsMessagesService {
  constructor() {}
  private defaultMessages: customMessage = {
    required: 'formErrors.required',
    email: 'formErrors.email',
    minlength: 'formErrors.minlength',
    maxlength: 'formErrors.maxlength',
    pattern: 'formErrors.pattern',
    duplicate: 'formErrors.duplicate',
    unique: 'formErrors.unique',
    min: 'formErrors.min',
    max: 'formErrors.max',
    zero: 'formErrors.zero',
  };
  getErrorMessage(
    control: AbstractControl | null,
    customMessages?: customMessage | null,
  ): string {
    if (!control || !control.errors) return '';
    const errors: ValidationErrors = control.errors;
    const errorMessages: string[] = [];
    (Object.keys(errors) as Array<keyof customMessage>).forEach((key) => {
      if (customMessages && customMessages[key]) {
        errorMessages.push(customMessages[key]!);
      } else {
        errorMessages.push(this.defaultMessages[key] || 'invalid-field');
      }
    });
    return errorMessages.join('<br />');
  }
}

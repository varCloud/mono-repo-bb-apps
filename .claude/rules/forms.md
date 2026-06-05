# Formularios — ReactiveFormsModule

- Usar **solo ReactiveFormsModule** — nunca template-driven forms.
- Construir con `FormBuilder`, `FormGroup`, `FormArray`, `FormControl`.
- Los validadores custom van en `libs/shared/helpers/form-validators.ts`.
- Binding en template: `[formGroup]="form"`, `[formControl]="control"`.

import {FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const firstPass = control.get('password');
  const secondPass = control.get('confirmPassword');
  return secondPass.value !== firstPass.value ? { passwordNoMatch: true } : null;
};


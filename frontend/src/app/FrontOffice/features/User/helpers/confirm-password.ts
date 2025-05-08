import { FormGroup } from "@angular/forms";

export function confirmPasswordValidator(controlName: string, matchControlName: string) {
  return (formGroup: FormGroup) => {
    const passwordControl = formGroup.controls[controlName];
    const confirmPasswordControl = formGroup.controls[matchControlName];

    // Skip validation if confirmPasswordControl already has an error
    if (confirmPasswordControl.errors && confirmPasswordControl.errors['confirmPasswordValidator']) {
      return;
    }

    // Check if passwords match
    if (passwordControl.value !== confirmPasswordControl.value) {
      confirmPasswordControl.setErrors({ confirmPasswordValidator: true });
    } else {
      confirmPasswordControl.setErrors(null);
    }
  };
}

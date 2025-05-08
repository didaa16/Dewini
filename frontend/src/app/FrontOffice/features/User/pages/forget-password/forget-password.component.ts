import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/services/authentication.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent {
  forgetPasswordForm: FormGroup;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService
  ) {
    this.forgetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgetPasswordForm.invalid) {
      this.forgetPasswordForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const email = this.forgetPasswordForm.value.email;

    this.authService.requestPasswordReset({ email }).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = `Un email de réinitialisation a été envoyé à ${email}. Vérifiez votre boîte mail.`;
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Erreur lors de l\'envoi du lien de réinitialisation';
        console.error('Forget password error:', err);
      }
    });
  }
}

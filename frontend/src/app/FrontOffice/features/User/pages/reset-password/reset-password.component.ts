import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from "../../services/services/authentication.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  token: string | null = null;
  newPassword: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  resetForm!:FormGroup;
  constructor(
    private fb : FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });

    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.errorMessage = 'Token de réinitialisation manquant. Veuillez vérifier l\'URL.';
    }
  }

  passwordsDontMatch(): boolean {
    const password = this.resetForm.get('password')?.value;
    const confirmPassword = this.resetForm.get('confirmPassword')?.value;
    return password && confirmPassword && password !== confirmPassword;
  }

  resetPassword(): void {
    if (this.token && !this.passwordsDontMatch() && this.resetForm.valid) {
      const newPassword = this.resetForm.get('password')?.value;

      const params = {
        body: {
          token: this.token,
          newPassword: newPassword
        }
      };

      this.authService.resetPassword(params).subscribe(
        (response) => {
          this.successMessage = 'Votre mot de passe a été réinitialisé avec succès. Vous allez être redirigé vers la page de connexion.';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        },
        (error) => {
          console.error('Error resetting password', error);
          this.errorMessage = 'Une erreur est survenue lors de la réinitialisation du mot de passe. Veuillez réessayer plus tard.';
        }
      );
    } else {
      this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire.';
    }
  }

}

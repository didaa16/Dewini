import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { AuthenticationService } from "../../services/services/authentication.service";

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.css']
})
export class ActivateAccountComponent {
  message: string = '';
  isOkay: boolean = true;
  submitted: boolean = false;
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthenticationService  // Ajout de 'private' pour l'injection
  ) { }

  onCodeCompleted(token: string) {  // Correction du type String -> string
    this.isLoading = true;
    this.submitted = false;

    this.authService.confirm({
      token: token
    }).subscribe({
      next: (res) => {
        this.message = 'Votre compte a été activé avec succès.\nVous pouvez maintenant vous connecter.';
        this.isOkay = true;
        this.submitted = true;
      },
      error: (err) => {
        console.error('Activation error:', err);
        this.message = 'Le lien d\'activation a expiré ou est invalide.';
        this.isOkay = false;
        this.submitted = true;
      }
    });
  }

  redirectToLogin() {
    this.router.navigate(['login']);
  }
}

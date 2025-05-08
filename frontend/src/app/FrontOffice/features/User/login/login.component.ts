import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../services/services/authentication.service';
import { AuthenticationRequest } from '../services/models/authentication-request';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/notification.service';
import { UserControllerService } from '../services/services/user-controller.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @Output() closeModal = new EventEmitter<void>();
  errorMessage: string[] = [];
  loginForm!: FormGroup;
  isText: boolean = false;
  eyeIcon: string = 'bi-eye-slash';
  type: string = 'password';
  loading = false;
  user: any; // Déclarez la propriété user


  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private fb: FormBuilder,
    private notifyService: NotificationService,
    private route: ActivatedRoute,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['token'] && params['refreshToken']) {
        this.handleAuthCallback(params['token'], params['refreshToken']);
      }
    });
  }
  private handleAuthCallback(token: string, refreshToken: string): void {
    this.loading = true;
    this.authService.handleAuthCallback(token, refreshToken)
      .subscribe({
        next: () => this.redirectAfterLogin(),
        error: (err) => {
          console.error('Auth error:', err);
          this.notifyService.showError('Authentication failed', 'Error');
          this.router.navigate(['/login']);
          this.loading = false;
        }
      });
  }
  private redirectAfterLogin(): void {
    this.loading = false;
    const redirectUrl = this.authService.isAdmin() ? '/dashboard' : '/home';
    this.router.navigate([redirectUrl]);
    this.notifyService.showSuccess('Login successful', 'Welcome!');
  }
  loginWithFacebook() {
    this.authService.loginWithFacebook();
  }
  // Dans LoginComponent
loginWithGoogle() {
  this.authService.loginWithGoogle();
}
  

  // login.component.ts
  login() {
    this.errorMessage = [];
  
    if (this.loginForm.invalid) {
      this.notifyService.showError('Veuillez remplir tous les champs correctement', 'Formulaire invalide');
      return;
    }
  
    this.loading = true; // Active le spinner
  
    const credentials: AuthenticationRequest = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };
  
    this.authService.authenticate({ body: credentials }).subscribe({
      next: (res) => {
        if (res.token) {
          // Lance le message vocal AVANT la navigation
          this.authService.playWelcomeSound(this.loginForm.value.email.split('@')[0]);
          
          localStorage.setItem('token', res.token);
          
          const redirectPath = this.authService.isAdmin() ? '/dashboard' : '/home';
          this.router.navigate([redirectPath]);
          this.notifyService.showSuccess('Connexion réussie', 'Bienvenue !');
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur auth:', err);
        this.errorMessage = ['Email ou mot de passe incorrect'];
        this.notifyService.showError('Authentification échouée', 'Erreur');
        this.loading = false;
      }
    });
  }
  loginWithGitHub() {
    this.authService.loginWithGitHub();
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.eyeIcon = this.isText ? 'bi-eye' : 'bi-eye-slash';
    this.type = this.isText ? 'text' : 'password';
  }

  validateEmail() {
    if (this.loginForm.get('email')?.invalid && (this.loginForm.get('email')?.touched || this.loginForm.get('email')?.dirty)) {
      this.notifyService.showError('L\'email est requis et doit être valide.', 'Erreur de saisie');
    }
  }

  validatePassword() {
    if (this.loginForm.get('password')?.invalid && (this.loginForm.get('password')?.touched || this.loginForm.get('password')?.dirty)) {
      this.notifyService.showError('Le mot de passe est requis.', 'Erreur de saisie');
    }
  }

  registre() {
    this.router.navigate(['register']);
  }


startFaceAuth(): void {
  // Enregistrez l'URL actuelle avant la redirection
  localStorage.setItem('preAuthUrl', this.router.url);
  this.router.navigate(['/face-auth']);
}

}

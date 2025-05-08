import { Component, HostListener, OnDestroy } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../features/User/services/services';
import { Subscription } from 'rxjs';

import { PanierService } from 'src/app/services/panier/panier.service'; // adapte le chemin si besoin


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnDestroy {
  userId: string | null = null;
  isAuthenticated: boolean = false;
  isNavbarCollapsed = true;
  currentRoute: string = '';
  dropdownOpen = false;
  private routeSub: Subscription | undefined;
  public userRole = this.authService.getCurrentUser()?.roles;



  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    public panierService: PanierService
  ) {
    this.checkAuthentication();
    this.setupRouteListener();
    this.setupAuthCallbacks(); // Modifié pour gérer tous les types d'authentification
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  private checkAuthentication(): void {
    this.isAuthenticated = this.authService.isLoggedIn();
    const id = this.authService.getUserIdFromToken();
    this.userId = id !== null ? id.toString() : null;
    console.log(this.userRole);
  }

  private setupRouteListener(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
        this.checkAuthentication(); // Vérifie l'authentification à chaque changement de route
      }
    });
  }

  private setupAuthCallbacks(): void {
    this.routeSub = this.route.queryParams.subscribe(params => {
      // Callback pour GitHub
      if (params['token'] && params['refreshToken']) {
        this.handleAuthCallback(params['token'], params['refreshToken']);
      }
      // Callback pour l'authentification faciale
      else if (params['faceAuthToken']) {
        this.handleFaceAuthCallback(params['faceAuthToken'], params['refreshToken']);
      }
    });
  }

  private handleAuthCallback(token: string, refreshToken: string): void {
    this.authService.handleAuthCallback(token, refreshToken).subscribe({
      next: () => {
        this.checkAuthentication();
        this.redirectAfterLogin();
      },
      error: (err) => {
        console.error('Authentication error:', err);
        this.router.navigate(['/home']);
      }
    });
  }

  private handleFaceAuthCallback(token: string, refreshToken: string): void {
    this.authService.handleAuthCallback(token, refreshToken).subscribe({
      next: () => {
        this.checkAuthentication();
        this.redirectAfterLogin();
      },
      error: (err) => {
        console.error('Face authentication error:', err);
        this.router.navigate(['/home']);
      }
    });
  }

  private redirectAfterLogin(): void {
    const redirectUrl = this.authService.isAdmin() ? '/dashboard' : '/home';
    this.router.navigate([redirectUrl]);
  }

  // Méthodes d'authentification
  loginWithGitHub(): void {
    this.authService.loginWithGitHub();
  }

  loginWithFace(): void {
    // Sauvegarde l'URL actuelle pour redirection après authentification
    localStorage.setItem('preAuthUrl', this.router.url);
    this.router.navigate(['/face-auth']);
  }

  // Méthodes existantes...
  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  goToUserProfile(): void {
    this.dropdownOpen = false;
    if (this.userId) {
      this.router.navigate([`/user-profile/${this.userId}`]);
    } else {
      this.router.navigate(['/login']);
    }
  }

  logout(): void {
    this.dropdownOpen = false;
    this.authService.logout();
    this.isAuthenticated = false;
    this.router.navigate(['/login']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown') && this.dropdownOpen) {
      this.dropdownOpen = false;
    }
  }
}

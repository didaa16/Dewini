import { Component } from '@angular/core';
import { NotificationService } from './notification.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
  showDashboardHome = false;
  showHeaderFooter = true;

  constructor(
    private notifyService: NotificationService,
    private router: Router
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateHeaderFooterVisibility(event.url);
      }
    });
  }

  private updateHeaderFooterVisibility(url: string): void {
    const isLoginPage = this.isLoginRoute() || this.isLoginRouteer() || this.isLoginnRoute() || this.isLoginRouter();
    const isDashboardPage = url.includes('/dashboard');
    this.showHeaderFooter = !isLoginPage && !isDashboardPage;
  }

  isLoginRouteer(): boolean {
    return this.router.url === '/forget-password';
  }

  isLoginRoute(): boolean {
    return this.router.url === '/login';
  }
  isLoginRouter(): boolean {
    return this.router.url === '/face-auth';
  }

  isLoginnRoute(): boolean {
    return this.router.url === '/register';
  }

  toggleView(): void {
    this.showDashboardHome = !this.showDashboardHome;
    this.updateHeaderFooterVisibility(this.router.url);
  }

  showToasterSuccess() {
    this.notifyService.showSuccess("Connexion réussie!", "Bienvenue");
  }

  showToasterError() {
    this.notifyService.showError("Les informations de connexion sont incorrectes.", "Erreur");
  }

  showToasterInfo() {
    this.notifyService.showInfo("Vous êtes maintenant connecté", "Info");
  }

  showToasterWarning() {
    this.notifyService.showWarning("Avertissement", "Attention");
  }
}

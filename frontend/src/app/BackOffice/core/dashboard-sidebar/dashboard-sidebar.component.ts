import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {AuthenticationService} from "../../../FrontOffice/features/User/services/services/authentication.service";
import {AdminControllerService} from "../../../FrontOffice/features/User/services/services/admin-controller.service";

@Component({
  selector: 'app-dashboard-sidebar',
  templateUrl: './dashboard-sidebar.component.html',
  styleUrls: ['./dashboard-sidebar.component.css']
})
export class DashboardSidebarComponent {
  isMenuCollapsed = false;
  userId!: number; // Déclaration du userId

  // Track the open/closed state of each submenu
  submenuStates: { [key: string]: boolean } = {
    dashboard: false,
    users: false,
    rendezvous: false,
    dossiersMedicaux: false,
    pharmacie: false,
    urgences: false,
    actualites: false,
    dons: false
  };

  // Track the currently active menu
  activeMenu: string | null = null;

  constructor(
    private authService: AuthenticationService,
    private userService: AdminControllerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Vérification de la méthode correcte pour obtenir l'ID utilisateur
    const userId = this.authService.getUserIdFromToken(); // Utilise la méthode getUserIdFromToken pour obtenir l'ID
    if (userId) {
      this.userId = userId; // Récupère l'ID de l'utilisateur
      this.userService.getUserById({ id: this.userId }).subscribe(user => {
        // Gérer l'utilisateur récupéré si nécessaire
        console.log(user);
      });
    } else {
      console.log('Aucun utilisateur connecté');
    }
  }

  toggleMenu(event: Event): void {
    event.preventDefault();
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  toggleSubmenu(event: Event, menuType: string): void {
    event.preventDefault();
    // Toggle the specific submenu state
    this.submenuStates[menuType] = !this.submenuStates[menuType];
  }

  setActiveMenu(menuType: string): void {
    // Set the active menu
    this.activeMenu = menuType;
  }

  navigateTo(route: string, menuType: string): void {
    // Navigate to the route and set the active menu
    this.setActiveMenu(menuType);
    this.router.navigate([route]);
  }

}

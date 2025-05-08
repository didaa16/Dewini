import { Component, AfterViewInit } from '@angular/core';
import {AdminControllerService} from "../../../FrontOffice/features/User/services/services/admin-controller.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.css']
})
export class DashboardHeaderComponent implements AfterViewInit {
  constructor(private router:Router, private adminService:AdminControllerService ) {
  }
  ngAfterViewInit(): void {
    this.loadGithubButton();
  }

  private loadGithubButton(): void {
    const script = document.createElement('script');
    script.src = 'https://buttons.github.io/buttons.js';
    script.async = true;
    document.head.appendChild(script);
  }

  toggleMenu(event: Event): void {
    event.preventDefault();
    // Add your menu toggle logic here
    console.log('Menu toggle clicked');
  }

  handleLogout(event: Event): void {
    event.preventDefault(); // empêche le comportement par défaut du lien
    this.adminService.logout(); // supprime le token
    this.router.navigate(['/login']); // redirige vers la page de connexion
  }
}

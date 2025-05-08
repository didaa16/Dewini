import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from "src/app/FrontOffice/features/User/services/models/user";
import { AdminControllerService } from "src/app/FrontOffice/features/User/services/services/admin-controller.service";
import { AuthenticationService } from "src/app/FrontOffice/features/User/services/services/authentication.service";
import { UserControllerService } from 'src/app/FrontOffice/features/User/services/services';

export interface ExtendedUser extends User {
  id: number;
  email: string;
  banned: boolean;
  pendingUnbanRequest?: boolean;
  firstname?: string;
  lastname?: string;
  enabled?: boolean;
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: ExtendedUser[] = [];
  isLoading = true;
  errorMessage = '';
  successMessage = '';

  constructor(
    private adminService: AdminControllerService,
    private router: Router,
    public authService: AuthenticationService,
    public userService: UserControllerService
  ) { }

  ngOnInit() {
    if (!this.authService.isAdmin()) {
      this.errorMessage = 'Accès réservé aux administrateurs';
      this.router.navigate(['/home']);
      return;
    }
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';
  
    this.adminService.getAllUsers().subscribe({
      next: (users: User[]) => {
        this.users = users.map(user => {
          const extendedUser: ExtendedUser = {
            ...user,
            id: user.id || 0,
            email: user.email || '',
            banned: !user.enabled, // Map enabled to banned
            pendingUnbanRequest: false, // Initialize as false (you may need backend support for this)
            firstname: user.firstname,
            lastname: user.lastname,
            enabled: user.enabled
          };
          return extendedUser;
        });
        this.isLoading = false;
        console.log('Mapped users:', this.users);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        if (err.status === 401 || err.status === 403) {
          this.errorMessage = 'Accès refusé ou session expirée - Veuillez vous reconnecter';
          this.authService.logout();
          this.router.navigate(['/login']);
        } else {
          this.errorMessage = 'Erreur lors du chargement des utilisateurs';
        }
        console.error('Load users error:', err);
      }
    });
  }

  confirmDelete(user: ExtendedUser): void {
    if (confirm(`Supprimer définitivement ${user.firstname || 'cet utilisateur'} ?`)) {
      this.isLoading = true;
      this.adminService.deleteUser({ id: user.id }).subscribe({
        next: () => {
          this.successMessage = 'Utilisateur supprimé avec succès';
          this.loadUsers();
        },
        error: (err) => {
          this.handleError(err);
        }
      });
    }
  }

  banUser(userId: number): void {
    if (!userId) return;
  
    this.isLoading = true;
    this.adminService.banUser({ id: userId }).subscribe({
      next: (message) => {
        this.isLoading = false;
        this.successMessage = message || 'Utilisateur banni avec succès';
        const user = this.users.find(u => u.id === userId);
        if (user) {
          user.banned = true;
          user.enabled = false; // Update enabled
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.handleError(err);
      }
    });
  }
  
  unbanUser(userId: number): void {
    if (!userId) return;
  
    this.isLoading = true;
    this.adminService.unbanUser({ id: userId }).subscribe({
      next: (message) => {
        this.isLoading = false;
        this.successMessage = message || 'Utilisateur débanni avec succès';
        const user = this.users.find(u => u.id === userId);
        if (user) {
          user.banned = false;
          user.enabled = true; // Update enabled
          user.pendingUnbanRequest = false; // Reset pending request
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.handleError(err);
      }
    });
  }
  requestUnban(email: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.adminService.requestUnban(email).subscribe({
      next: (message) => {
        this.isLoading = false;
        this.successMessage = message || 'Demande envoyée avec succès';

        const user = this.users.find(u => u.email === email);
        if (user) {
          user.pendingUnbanRequest = true;
        }
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        if (err.status === 403) {
          this.errorMessage = 'Accès refusé : vous n\'avez pas les droits nécessaires';
        } else if (err.status === 404) {
          this.errorMessage = 'Utilisateur non trouvé';
        } else {
          this.errorMessage = `Erreur lors de la demande: ${err.message}`;
        }
      }
    });
  }

  private handleError(err: HttpErrorResponse): void {
    this.isLoading = false;

    if (err.status === 500) {
      this.errorMessage = 'Erreur serveur : Veuillez réessayer plus tard';
    } else {
      this.errorMessage = 'Une erreur est survenue : ' + err.message;
    }

    console.error('Erreur:', err);
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  refreshUsers(): void {
    this.loadUsers();
  }

  confirmBan(user: ExtendedUser): void {
    if (confirm(`Êtes-vous sûr de vouloir bannir ${user.firstname || 'cet utilisateur'} ?`)) {
      this.banUser(user.id);
    }
  }

  confirmUnban(user: ExtendedUser): void {
    if (confirm(`Êtes-vous sûr de vouloir débannir ${user.firstname || 'cet utilisateur'} ?`)) {
      this.unbanUser(user.id);
    }
  }
}

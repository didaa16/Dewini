import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../../services/models/user";
import {UserControllerService} from "src/app/FrontOffice/features/User/services/services/user-controller.service";
import {NotificationService} from "src/app/notification.service";
import { AuthenticationService } from '../../services/services';
import { StatsService } from '../../services/services/stats.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {
  userId: number | null = null;
  user: User | null = null;
  loading: boolean = false;
  errorMessage: string | null = null;
  userStats: any = {};
  statsLoading: boolean = false;
  constructor(
    private route: ActivatedRoute,
    public userService: UserControllerService,
    private notificationService: NotificationService, // Injection du service de notification
    private router: Router, // Injection correcte du service Router
private authService: AuthenticationService, // Injection du service d'authentification
private statsService: StatsService // Injection du service de statistiques
  ) {}

  ngOnInit(): void {
    const idFromRoute = this.route.snapshot.paramMap.get('userId');
    if (idFromRoute) {
      this.userId = +idFromRoute;
      console.log('✅ ID utilisateur récupéré:', this.userId);
      this.loadUserData();
    } else {
      this.errorMessage = "Aucun ID utilisateur trouvé dans l'URL.";
    }
    this.loadUserStats();

  }


  loadUserStats(): void {
    if (!this.userId) return;

    this.statsLoading = true;
    this.statsService.getUserStats(this.userId).subscribe({
      next: (data) => {
        this.userStats = data;
        this.statsLoading = false;
      },
      error: (err) => {
        console.error('Error loading user stats:', err);
        this.statsLoading = false;
      }
    });
  }
  loadUserData(): void {
    if (!this.userId) return;

    this.loading = true;
    this.errorMessage = null;

    this.userService.getUserById({ id: this.userId }).subscribe({
      next: (data) => {
        this.user = data;
        this.loading = false;
        console.log('✅ Données utilisateur récupérées:', data);
        console.log('URL de l\'image :', this.user.profilePicUrl);
      },
      error: (err) => {
        console.error('❌ Erreur de récupération utilisateur:', err);
        if (err.status === 404) {
          this.errorMessage = 'Utilisateur introuvable (404)';
        } else if (err.status === 403) {
          this.errorMessage = 'Accès refusé (403)';
        } else if (err.status === 500) {
          this.errorMessage = 'Erreur interne du serveur (500)';
        } else {
          this.errorMessage = 'Erreur inconnue lors du chargement des données.';
        }
        this.loading = false;
      }
    });
  }

  redirectToUpdateUser(): void {
    if (this.userId) {
      this.notificationService.showInfo('You can modify your profile if you want.', 'HELLO');
      
      // Utilisez la navigation relative pour éviter les erreurs de chemin
      this.router.navigate(['update-user', this.userId], { relativeTo: this.route.parent });
    }
  }
  isMedecin(): boolean {
    return this.authService.getUserRoleFromToken() === 'MEDECIN';
}

isUser(): boolean {
    return this.authService.getUserRoleFromToken() === 'USER';
}
}

import { Component } from '@angular/core';
import {User} from "../../../../../FrontOffice/features/User/services/models/user";
import {ActivatedRoute, Router} from '@angular/router';
import {AdminControllerService, UserControllerService} from 'src/app/FrontOffice/features/User/services/services';
import {NotificationService} from "../../../../../notification.service";

@Component({
  selector: 'app-profiluserr',
  templateUrl: './profiluserr.component.html',
  styleUrls: ['./profiluserr.component.css']
})
export class ProfiluserrComponent {
  userId: number | null = null;
  user: User | null = null;
  loading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private userService: AdminControllerService,
    private notificationService: NotificationService, // Injection du service de notification
    private router: Router // Injection correcte du service Router
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

 
}

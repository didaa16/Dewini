import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Rendezvous } from 'src/app/models/ModelsRendezvous/Rendezvous';
import { RendezvousService } from 'src/app/services/Rendezvous/rendezvous.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from '../../User/services/services';

interface RendezvousWithReminder extends Rendezvous {
  
  reminderSent?: boolean;
  isWithin24Hours?: boolean;
}

@Component({
  selector: 'app-list-rendezvous',
  templateUrl: './list-rendezvous.component.html',
  styleUrls: ['./list-rendezvous.component.css']
})
export class ListRendezvousComponent implements OnInit {
  rendezvousList: RendezvousWithReminder[] = [];
  isLoading: boolean = true;
  isSendingReminders: boolean = false;
  errorMessage: string | null = null;
  showDeletePopup = false;
rendezvousToDelete: number | null = null;
currentUserId: number | null = null;
  constructor(
    private rendezvousService: RendezvousService, 
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthenticationService // Ajoutez ceci

  ) { }

  ngOnInit(): void {
    this.currentUserId = this.authService.getUserId(); // Récupération de l'ID utilisateur
    this.loadRendezvous();
  }

  loadRendezvous(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.rendezvousService.getAllRendezvous().subscribe({
      next: (data) => {
        this.rendezvousList = data.map(rdv => {
          const isWithin24h = this.checkIfWithin24Hours(rdv.dateRendezvous, rdv.heureRendezvous);
          return {
            ...rdv,
            reminderSent: (rdv as any).reminderSent || false,
            isWithin24Hours: isWithin24h,
            emailPatient: rdv.emailPatient?.trim() || 'Email manquant',
            dateRendezvous: this.formatDate(rdv.dateRendezvous),
            dateNaissance: this.formatDate(rdv.dateNaissance)
          };
        });
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erreur:', err);
        this.errorMessage = err.error?.message || 'Erreur de chargement des rendez-vous';
        this.isLoading = false;
      }
    });
  }

  checkIfWithin24Hours(dateStr: string, timeStr: string): boolean {
    try {
      const date = new Date(dateStr);
      const [hours, minutes] = timeStr.split(':').map(Number);
      date.setHours(hours, minutes);
      
      const now = new Date();
      const diffHours = (date.getTime() - now.getTime()) / (1000 * 60 * 60);
      
      return diffHours <= 24 && diffHours >= 0;
    } catch {
      return false;
    }
  }

  sendReminders(): void {
    this.isSendingReminders = true;
    
    this.rendezvousService.sendReminders().subscribe({
      next: () => {
        this.snackBar.open('Rappels envoyés avec succès !', 'Fermer', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        
        // Mise à jour locale sans rechargement complet
        this.rendezvousList = this.rendezvousList.map(rdv => ({
          ...rdv,
          reminderSent: rdv.isWithin24Hours ? true : rdv.reminderSent
        }));
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erreur:', err);
        this.snackBar.open(
          err.error?.message || 'Erreur lors de l\'envoi des rappels', 
          'Fermer', 
          { duration: 3000, panelClass: ['error-snackbar'] }
        );
      },
      complete: () => {
        this.isSendingReminders = false;
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR');
    } catch {
      return dateString;
    }
  }

  navigateToAddForm(): void {
    this.router.navigate(['/add-rendezvous']);
  }
  navigateToEditForm(rendezvous: Rendezvous): void {
    if (!this.currentUserId) {
      this.snackBar.open('Vous devez être connecté pour modifier un rendez-vous', 'Fermer', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }
  
    // Solution simplifiée avec une route plus propre
    this.router.navigate(['/edit-rendezvous', rendezvous.idRendezvous], {
      state: { 
        rendezvousData: rendezvous,
        userId: this.currentUserId
      }
    });
  }
  deleteRendezvous(id: number): void {
    this.rendezvousToDelete = id;
    this.showDeletePopup = true;
  }
  // Ajoutez ces nouvelles méthodes
confirmDelete(): void {
  if (this.rendezvousToDelete) {
    this.rendezvousService.deleteRendezvous(this.rendezvousToDelete).subscribe({
      next: () => {
        this.rendezvousList = this.rendezvousList.filter(r => r.idRendezvous !== this.rendezvousToDelete);
        this.snackBar.open('Rendez-vous supprimé avec succès', 'Fermer', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: (err) => {
        console.error('Erreur suppression:', err);
        this.snackBar.open('Échec de la suppression', 'Fermer', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      },
      complete: () => {
        this.showDeletePopup = false;
        this.rendezvousToDelete = null;
      }
    });
  }
}
cancelDelete(): void {
  this.showDeletePopup = false;
  this.rendezvousToDelete = null;
}

  shouldShowAsSent(rdv: RendezvousWithReminder): boolean {
    return !!rdv.reminderSent || !!rdv.isWithin24Hours;
  }
}
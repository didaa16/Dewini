import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { Rendezvous } from 'src/app/models/ModelsRendezvous/Rendezvous';
import { Reponse } from 'src/app/models/ModelsRendezvous/Reponse';
import { DiagnosticService } from 'src/app/services/diagnostic/diagnostic.service';
import { RendezvousService } from 'src/app/services/Rendezvous/rendezvous.service';
import { ReponseService } from 'src/app/services/Reponse/reponse.service';

@Component({
  selector: 'app-list-reponse-admin',
  templateUrl: './list-reponse-admin.component.html',
  styleUrls: ['./list-reponse-admin.component.css']
})
export class ListReponseAdminComponent {
  rendezvousList: Rendezvous[] = [];
    rendezvousWithStatus: any[] = [];
    reponsesList: Reponse[] = [];
    isLoading: boolean = true;
    errorMessage: string | null = null;
    selectedRendezvousId: number | null = null;
    stats: any;
    isSendingReminders: boolean = false;
    drBertResults: { [rdvId: number]: number } = {};  // DrBert Results storage
  
    constructor(
      private rendezvousService: RendezvousService,
      private reponseService: ReponseService,
      private diagnosticService: DiagnosticService,
      private snackBar: MatSnackBar
    ) { }
  
    ngOnInit(): void {
      this.loadData();
      
    }
  
    loadData(): void {
      this.isLoading = true;
      this.errorMessage = null;
  
      forkJoin([
        this.rendezvousService.getAllRendezvous(),
        this.reponseService.getRendezVousStats()
      ]).subscribe({
        next: ([rdvData, statsData]) => {
          this.rendezvousList = rdvData;
          this.rendezvousList.forEach(rdv => {
            if (rdv.medicalState) {
              this.analyzeMedicalState(rdv);
            }
          });
          
          this.stats = {
            avecReponse: statsData.parPresenceReponse?.avecReponse || 0,
            sansReponse: statsData.parPresenceReponse?.sansReponse || 0
          };
          this.loadRendezvousStatus();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erreur:', err);
          this.errorMessage = 'Erreur lors du chargement des données';
          this.isLoading = false;
        }
      });
    }
  
    loadRendezvousStatus(): void {
      this.rendezvousWithStatus = [];
      this.rendezvousList.forEach(rdv => {
        if (rdv.idRendezvous !== undefined && rdv.idRendezvous !== null) {
          this.reponseService.checkIfResponseExists(rdv.idRendezvous).subscribe({
            next: (hasResponse) => {
              this.rendezvousWithStatus.push({
                ...rdv,
                hasResponse: hasResponse
              });
            },
            error: (err) => {
              console.error('Erreur pour le RDV', rdv.idRendezvous, err);
              this.rendezvousWithStatus.push({
                ...rdv,
                hasResponse: false
              });
            }
          });
        } else {
          console.warn('Rendez-vous sans ID:', rdv);
          this.rendezvousWithStatus.push({
            ...rdv,
            hasResponse: false
          });
        }
      });
    }
  
    loadReponses(rendezvousId: number): void {
      this.selectedRendezvousId = rendezvousId;
      this.isLoading = true;
  
      this.reponseService.getReponsesByRendezvousId(rendezvousId).subscribe({
        next: (data) => {
          this.reponsesList = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erreur:', err);
          this.errorMessage = `Erreur lors du chargement des réponses pour le rendez-vous ${rendezvousId}`;
          this.isLoading = false;
        }
      });
    }
  
    deleteReponse(id: number): void {
      if (confirm('Êtes-vous sûr de vouloir supprimer cette réponse ?')) {
        this.reponseService.deleteReponse(id).subscribe({
          next: () => {
            if (this.selectedRendezvousId) {
              this.loadReponses(this.selectedRendezvousId);
            }
            this.loadData();
            this.showSuccess('Réponse supprimée avec succès');
          },
          error: (err: any) => {
            console.error('Erreur:', err);
            this.showError('Erreur lors de la suppression de la réponse');
          }
        });
      }
    }
  
    sendReminders(): void {
      this.isSendingReminders = true;
      this.rendezvousService.sendReminders().subscribe({
        next: () => {
          this.isSendingReminders = false;
          this.showSuccess('Rappels envoyés avec succès');
          this.loadData(); // Rafraîchir les données
        },
        error: (err) => {
          this.isSendingReminders = false;
          this.showError('Erreur lors de l\'envoi des rappels');
          console.error(err);
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
  
    refreshList(): void {
      this.loadData();
      if (this.selectedRendezvousId) {
        this.loadReponses(this.selectedRendezvousId);
      }
    }
  
    getPercentage(part: number, total: number): number {
      return total > 0 ? Math.round((part / total) * 100) : 0;
    }
  
    private showSuccess(message: string): void {
      this.snackBar.open(message, 'Fermer', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    }
  
    private showError(message: string): void {
      this.snackBar.open(message, 'Fermer', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
    analyzeMedicalState(rdv: Rendezvous): void {
      if (!rdv.medicalState || !rdv.idRendezvous) {
        this.showError('Le texte médical est vide ou l\'ID du rendez-vous est manquant.');
        return;
      }
    
      this.diagnosticService.analyzeText(rdv.medicalState).subscribe({
        next: (result) => {
          // Assuming the result is an array, take the first item and extract the score
          const score = result[0]?.score;
          if (score !== undefined) {
            this.drBertResults[rdv.idRendezvous!] = score;
            console.log('Score for Rendezvous ID', rdv.idRendezvous, ':', score);
          } else {
            this.showError('Aucun score trouvé dans la réponse.');
          }
          this.showSuccess('Analyse terminée avec succès');
        },
        error: (err) => {
          console.error('Erreur lors de l\'analyse DrBert:', err);
          this.showError('Erreur lors de l\'analyse du texte médical');
        }
      });
    }
    

}

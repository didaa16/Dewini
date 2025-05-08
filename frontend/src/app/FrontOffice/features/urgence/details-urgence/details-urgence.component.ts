import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UrgenceService } from '../../User/services/services/urgence.service';
import { Urgence } from '../../../../models/urgence';
import { HttpErrorResponse } from "@angular/common/http";
import {ConsultationUrgenteService} from "../../User/services/services/consultation-urgente.service";
import {NotificationService } from "../../../../notification.service";

@Component({
  selector: 'app-details-urgence',
  templateUrl: './details-urgence.component.html',
  styleUrls: ['./details-urgence.component.css']
})
export class DetailsUrgenceComponent implements OnInit {
  urgence!: Urgence;

  constructor(
    private us: UrgenceService,
    private cus: ConsultationUrgenteService,
    private rt: Router,
    private act: ActivatedRoute,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const idUrgence = this.act.snapshot.params['idUrgence'];
    this.us.getUrgenceById(idUrgence).subscribe(
      (data) => {
        this.urgence = data;
        console.log(this.urgence.medecin?.address);
      },
      (error) => {
        console.error('Erreur lors de la récupération des détails :', error);
        // alert('Une erreur est survenue lors de la récupération des détails.');
        this.notificationService.showError('Une erreur est survenue lors de la récupération des détails.');
      }
    );
  }

  // Ajout des méthodes manquantes
  getPriorityClass(priority: string): string {
    switch(priority) {
      case 'critique': return 'priority-critical';
      case 'moyen': return 'priority-medium';
      case 'faible': return 'priority-low';
      default: return 'priority-default';
    }
  }

  getTypeClass(type: string): string {
    switch (type) {
      case 'A_Domicile':
        return 'À DOMICILE';
      case 'En_Ligne':
        return 'EN LIGNE';
      default:
        return type;
    }
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'En_Attente': return 'En_Attente';
      case 'En_Cours': return 'En_Cours';
      case 'Traite': return 'Traite';
      default: return 'status-default';
    }
  }

  // Les autres méthodes restent inchangées
  backToList(): void {
    this.rt.navigateByUrl('/listUrgences');
  }

  deleteUrgence(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette urgence ?')) {
      this.us.deleteUrgence(id).subscribe(
        () => {
          this.notificationService.showSuccess('Urgence supprimée avec succès !');
          // alert('Urgence supprimée avec succès !');
          this.backToList();
        },
        (error: HttpErrorResponse) => {
          console.error('Erreur lors de la suppression :', error);
          // alert(`Une erreur est survenue : ${error.error?.message || error.message}`);
          this.notificationService.showError(`Une erreur est survenue : ${error.error?.message || error.message}`);
        }
      );
    }
  }
  formatStatut(statut: string): string {
    switch (statut) {
      case 'En_Attente': return 'EN ATTENTE';
      case 'En_Cours': return 'EN COURS';
      case 'Traite': return 'TRAITÉ';
      default: return statut;
    }
  }
  formatType(type: string): string {
    switch (type) {
      case 'A_Domicile': return 'À DOMICILE';
      case 'En_Ligne': return 'EN LIGNE';
      default: return type;
    }
  }
  goToPatientProfile() {
    console.log('Redirection vers le profil du patient');
  }
  goToMedecinProfile() {
    console.log('Redirection vers le profil du médecin');
  }
  toggleAmbulance(): void {
    if (!this.urgence?.consultationUrgente?.idConsultationUrgente) {
      console.error("ConsultationUrgente ID manquant !");
      return;
    }
    const id = this.urgence.consultationUrgente.idConsultationUrgente;
    this.cus.ambulance(id).subscribe({
      next: (updatedConsultation) => {
        this.urgence.consultationUrgente = updatedConsultation;
        console.log("Statut ambulance mis à jour :", updatedConsultation.ambulance);
      },
      error: (err) => {
        console.error("Erreur lors de la mise à jour du statut ambulance :", err);
        // alert("Impossible de mettre à jour le statut ambulance !");
        this.notificationService.showError("Impossible de mettre à jour le statut ambulance !");
      }
    });
  }
}

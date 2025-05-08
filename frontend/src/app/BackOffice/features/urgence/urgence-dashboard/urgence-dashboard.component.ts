import { Component, OnInit } from '@angular/core';
import { UrgenceService } from "../../../../FrontOffice/features/User/services/services/urgence.service";
import { HttpErrorResponse } from "@angular/common/http";
import { StatutUrgence, Urgence } from "../../../../models/urgence";
import { NotificationService } from "../../../../notification.service";

@Component({
  selector: 'app-urgence-dashboard',
  templateUrl: './urgence-dashboard.component.html',
  styleUrls: ['./urgence-dashboard.component.css']
})
export class UrgenceDashboardComponent implements OnInit {
  public urgences: Urgence[] = [];
  public filteredUrgences: Urgence[] = [];
  public searchQuery: string = '';

  constructor(
    private urgenceService: UrgenceService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadUrgences();
  }

  private loadUrgences(): void {
    this.urgenceService.getUrgences().subscribe(
      (response: Urgence[]) => {
        this.urgences = response;
        this.filteredUrgences = [...this.urgences];
      },
      (error: HttpErrorResponse) => {
        console.error('Erreur lors du chargement des urgences:', error);
      }
    );
  }

  filterUrgences(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredUrgences = this.urgences.filter(urgence =>
      (urgence.patient?.firstname?.toLowerCase().includes(query) || '') ||
      (urgence.addressePatient?.toLowerCase().includes(query) || '') ||
      (urgence.medecin?.firstname?.toLowerCase().includes(query) || '')
    );
  }

  getStatusBadgeClass(status: StatutUrgence): string {
    switch (status) {
      case StatutUrgence.En_Attente: return 'bg-label-warning';
      case StatutUrgence.En_Cours: return 'bg-label-primary';
      case StatutUrgence.Traite: return 'bg-label-success';
      default: return 'bg-label-secondary';
    }
  }

  formatDate(date: Date): string {
    if (!date) return 'Non renseignée';

    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

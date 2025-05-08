
import { ParticipationService } from '../../../../services/participation.service';
import { Participation, StatutParticipation } from '../../../../models/Participation';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Chart, ChartConfiguration, ChartData, ChartType } from 'chart.js';
@Component({
  selector: 'app-participations',
  templateUrl: './participations.component.html',
  styleUrls: ['./participations.component.css']
})
export class ParticipationsComponent {
 participations: any[] = [];
  evenementId!: number;
  stats: any = {};

  @ViewChild('statusChart', { static: false }) statusChartCanvas!: ElementRef;
  @ViewChild('presenceChart', { static: false }) presenceChartCanvas!: ElementRef;

 
  selectedParticipation: Participation | null = null;
  isAddMode: boolean = false;  // Changement ici, on ne permet plus l'ajout
  errorMessage: string | null = null;
  statutParticipationValues = Object.values(StatutParticipation);

  constructor(private participationService: ParticipationService) { }

  ngOnInit(): void {
    this.getParticipations();
    this.loadParticipationStats();
  }

  // Récupérer toutes les participations
  getParticipations(): void {
    this.participationService.getAll().subscribe(
      data => {
        this.participations = data;
      },
      error => {
        console.error(error);
      }
    );
  }
  loadParticipationStats(): void {
    this.participationService.getParticipationStats().subscribe(
      (data) => {
        this.stats = data;  // Récupère et assigne les statistiques
        this.drawStatusChart();  // Dessine les graphiques après avoir récupéré les données
        this.drawPresenceChart();  // Dessine le graphique de présence
      },
      (error) => {
        console.error('Erreur lors de la récupération des statistiques de participation:', error);
      }
    );
  }

  drawStatusChart(): void {
    const labels = Object.keys(this.stats.statusDistribution);
    const data = Object.values(this.stats.statusDistribution);

    const chartData: ChartData<'pie'> = {
      labels: labels,
      datasets: [{
        data: data as number[],  // Typage explicite
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],  // Couleurs des segments
      }]
    };

    const chartConfig: ChartConfiguration<'pie'> = {
      type: 'pie',
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.raw}`
            }
          }
        }
      }
    };

    // Crée le graphique en pie
    new Chart(this.statusChartCanvas.nativeElement, chartConfig);
  }
  drawPresenceChart(): void {
    const chartData: ChartData<'bar'> = {
      labels: ['Présent', 'Absent'],
      datasets: [{
        label: 'Présence',
        data: [this.stats.presenceRate, 1 - this.stats.presenceRate],  // Données de présence/absence
        backgroundColor: ['#36A2EB', '#FF6384'],
      }]
    };
  
    const chartConfig: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: chartData,
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,  // Force l'axe Y à commencer à zéro
            ticks: {
              stepSize: 0.2,  // Définir l'intervalle des ticks
            }
          }
        }
      }
    };
  
    // Crée le graphique en barres
    new Chart(this.presenceChartCanvas.nativeElement, chartConfig);
  }
  // Modifier une participation existante
  editParticipation(participation: Participation): void {
    this.selectedParticipation = { ...participation };
    this.isAddMode = false;
    this.errorMessage = null;
  }

  // Supprimer une participation
  deleteParticipation(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette participation ?')) {
      this.participationService.cancelParticipation(id).subscribe(
        () => {
          this.getParticipations();
          this.selectedParticipation = null;
        },
        error => {
          console.error(error);
        }
      );
    }
  }

  // Soumettre les modifications
  handleSubmit(): void {
    if (!this.selectedParticipation) {
      this.errorMessage = 'Aucune participation sélectionnée.';
      return;
    }

    // ----- Contrôle de saisie -----
    if (!this.selectedParticipation.evenement || !this.selectedParticipation.engagement) {
      this.errorMessage = 'Événement et participant sont obligatoires.';
      return;
    }

    if (this.selectedParticipation.prixPaye < 0) {
      this.errorMessage = 'Le prix payé ne peut pas être négatif.';
      return;
    }

    if (this.selectedParticipation.evaluationNote < 0 || this.selectedParticipation.evaluationNote > 5) {
      this.errorMessage = 'La note d\'évaluation doit être entre 0 et 5.';
      return;
    }
    // ----- Fin du contrôle de saisie -----

    this.errorMessage = null;

    // Mise à jour de la participation
    this.updateParticipation();
  }

  // Mettre à jour une participation existante
  updateParticipation(): void {
    if (!this.selectedParticipation || !this.selectedParticipation.id) return;
    this.participationService.updateParticipation(this.selectedParticipation.id, this.selectedParticipation).subscribe(
      () => {
        this.getParticipations();
        this.selectedParticipation = null;
      },
      error => {
        console.error(error);
      }
    );
  }

  // Annuler l'édition
  cancelEdit(): void {
    this.selectedParticipation = null;
    this.errorMessage = null;
  }
}

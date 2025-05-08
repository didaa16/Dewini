import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ParticipationService } from '../../../../services/participation.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Chart, ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-participation',
  templateUrl: './participation.component.html',
  styleUrls: ['./participation.component.css']
})
export class ParticipationComponent implements OnInit {

  participations: any[] = [];
  evenementId!: number;
  stats: any = {};

  @ViewChild('statusChart', { static: false }) statusChartCanvas!: ElementRef;
  @ViewChild('presenceChart', { static: false }) presenceChartCanvas!: ElementRef;

  constructor(
    private participationService: ParticipationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  showp(id: number) {
    this.router.navigate(['/prediction', id]);
  }

  ngOnInit(): void {
    // Récupération de l'ID de l'événement depuis l'URL
    this.evenementId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Événement ID récupéré :', this.evenementId);
    this.loadParticipations();
    this.loadParticipationStats();
  }

  loadParticipations() {
    this.participationService.getParticipationsByEvenement(this.evenementId).subscribe(
      (data) => {
        console.log('Participants chargés:', data);
        this.participations = data;
      },
      (error) => {
        console.error('Erreur de chargement:', error);
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
  
  

  cancelParticipation(id: number): void {
    this.participationService.cancelParticipation(id).subscribe(
      () => {
        this.participations = this.participations.filter(p => p.id !== id);
      },
      (error) => {
        console.error('Erreur lors de l\'annulation de la participation:', error);
      }
    );
  }
}

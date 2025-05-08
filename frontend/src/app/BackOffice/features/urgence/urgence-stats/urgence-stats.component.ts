import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UrgenceService } from '../../../../FrontOffice/features/User/services/services/urgence.service';
import { Chart, registerables } from 'chart.js';
import * as L from 'leaflet';
import 'leaflet.markercluster';

Chart.register(...registerables);
@Component({
  selector: 'app-urgence-stats',
  templateUrl: './urgence-stats.component.html',
  styleUrls: ['./urgence-stats.component.css']
})
export class UrgenceStatsComponent implements OnInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  @ViewChild('timelineSvg') timelineSvg!: ElementRef;

  currentDate: Date = new Date();
  treatedCount: number = 0;
  selectedPeriod: string = 'day';
  typeChart: any;
  statusChart: any;
  map!: L.Map;

  constructor(private urgenceService: UrgenceService) {
  }

  ngOnInit(): void {
    this.loadTreatedStats();
    this.loadTypeDistribution();
    this.loadStatusRatio();
    setInterval(() => {
      this.currentDate = new Date();
    }, 1000 * 60); // Actualise toutes les minutes
  }

  loadTreatedStats(): void {
    this.urgenceService.getTreatedStats(this.selectedPeriod).subscribe(count => {
      this.treatedCount = count;
    });
  }

  loadTypeDistribution(): void {
    this.urgenceService.getTypeDistribution().subscribe(distribution => {
      this.createTypeChart(Object.keys(distribution), Object.values(distribution));
    });
  }

  loadStatusRatio(): void {
    this.urgenceService.getStatusRatio().subscribe(ratio => {
      this.createStatusChart(Object.keys(ratio), Object.values(ratio));
    });
  }

  createTypeChart(labels: string[], data: number[]): void {
    if (this.typeChart) this.typeChart.destroy();

    this.typeChart = new Chart('typeChart', {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: ['#4CAF50', '#2196F3'],
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {position: 'bottom'},
          title: {
            display: true,
            text: 'Répartition par type d\'urgence'
          }
        }
      }
    });
  }

  createStatusChart(labels: string[], data: number[]): void {
    if (this.statusChart) this.statusChart.destroy();

    this.statusChart = new Chart('statusChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Nombre d\'urgences',
          data: data,
          backgroundColor: ['#FFCE56', '#21bf09', '#36A2EB'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {beginAtZero: true},
        },
        plugins: {
          legend: {display: false},
          title: {
            display: true,
            text: 'Répartition par statut d\'urgence'
          }
        }
      }
    });
  }

  onPeriodChange(period: string): void {
    this.selectedPeriod = period;
    this.loadTreatedStats();
  }
}




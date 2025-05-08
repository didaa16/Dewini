import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { AuthenticationService } from 'src/app/FrontOffice/features/User/services/services';
import { StatsService } from 'src/app/FrontOffice/features/User/services/services/stats.service';

@Component({
  selector: 'app-admin-stats',
  templateUrl: './admin-stats.component.html',
  styleUrls: ['./admin-stats.component.css']
})
export class AdminStatsComponent implements OnInit {
  stats: any = {
    usersByRole: { PATIENT: 0, DOCTOR: 0, ADMIN: 0 },
    activeAccounts: 0,
    inactiveAccounts: 0,
    genderDistribution: {},
    weeklyLoginStats: {},
    specialtyDistribution: {},
    loginComparison: '0%'
  };
  
  loading = true;

  constructor(private statsService: StatsService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.statsService.getAdminStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.createCharts();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading stats:', err);
        this.loading = false;
      }
    });
  }

  createCharts() {
    this.createRoleDistributionChart();
    this.createGenderDistributionChart();
    this.createSpecialtyChart();
    this.createMonthlyLoginChart();
  }

  createRoleDistributionChart() {
    const ctx = document.getElementById('roleChart') as HTMLCanvasElement;
    if (!ctx) return;

    Chart.getChart(ctx)?.destroy();

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(this.stats.usersByRole || {}),
        datasets: [{
          data: Object.values(this.stats.usersByRole || {}),
          backgroundColor: [
            '#36A2EB',
            '#FF6384',
            '#FFCE56'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'User Distribution by Role'
          }
        }
      }
    });
  }

  createGenderDistributionChart() {
    const ctx = document.getElementById('genderChart') as HTMLCanvasElement;
    if (!ctx) return;

    Chart.getChart(ctx)?.destroy();

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(this.stats.genderDistribution || {}),
        datasets: [{
          data: Object.values(this.stats.genderDistribution || {}),
          backgroundColor: [
            '#4BC0C0',
            '#9966FF',
            '#FF9F40'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Gender Distribution'
          }
        }
      }
    });
  }

  createMonthlyLoginChart() {
    const ctx = document.getElementById('loginChart') as HTMLCanvasElement;
    if (!ctx) return;

    const existingChart = Chart.getChart(ctx);
    if (existingChart) existingChart.destroy();

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Connexions mensuelles',
          data: Object.values(this.stats.weeklyLoginStats),
          borderColor: '#4e73df',
          backgroundColor: 'rgba(78, 115, 223, 0.05)',
          fill: true,
          tension: 0.3,
          pointBackgroundColor: '#4e73df',
          pointRadius: 3,
          pointHoverRadius: 5
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        }
      }
    });
  }
  createSpecialtyChart() {
    const ctx = document.getElementById('specialtyChart') as HTMLCanvasElement;
    if (!ctx) return;

    Chart.getChart(ctx)?.destroy();

    new Chart(ctx, {
      type: 'polarArea',
      data: {
        labels: Object.keys(this.stats.specialtyDistribution || {}),
        datasets: [{
          data: Object.values(this.stats.specialtyDistribution || {}),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Doctor Specialties Distribution'
          }
        }
      }
    });
  }
}
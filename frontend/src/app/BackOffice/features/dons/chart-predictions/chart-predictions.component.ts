import { Component, Input, OnChanges, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Chart, registerables, ChartOptions, ChartTypeRegistry } from 'chart.js';

@Component({
  selector: 'app-chart-predictions',
  template: '<canvas #chartCanvas></canvas>',
  styles: [`
    canvas {
      width: 100%;
      min-height: 400px;
      display: block;
    }
  `]
})
export class ChartPredictionsComponent implements OnChanges, AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas') private chartCanvas!: ElementRef<HTMLCanvasElement>;
  @Input() predictions: Array<{
    date: string;
    prediction: number;
    lower: number;
    upper: number;
  }> = [];
  
  private chart: Chart<'line'> | null = null;

  constructor() {
    Chart.register(...registerables);
  }

  ngAfterViewInit(): void {
    this.initChart();
  }

  ngOnChanges(): void {
    this.updateChart();
  }

  ngOnDestroy(): void {
    this.destroyChart();
  }

  private initChart(): void {
    if (!this.canvasContext) return;
    
    this.chart = new Chart(this.canvasContext, {
      type: 'line',
      data: this.chartData,
      options: this.chartOptions
    });
  }

  private updateChart(): void {
    if (!this.chart) return;
    
    this.chart.data = this.chartData;
    this.chart.update();
  }

  private destroyChart(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  private get canvasContext(): CanvasRenderingContext2D | null {
    return this.chartCanvas?.nativeElement?.getContext('2d') ?? null;
  }

  private get chartData() {
    return {
      labels: this.predictions.map(p => p.date),
      datasets: [
        {
          label: 'Prédiction',
          data: this.predictions.map(p => p.prediction),
          borderColor: '#4e73df',
          backgroundColor: '#4e73df',
          tension: 0.1,
          borderWidth: 2,
          pointRadius: 4,
          fill: false
        },
        {
          label: 'Intervalle de confiance',
          data: this.predictions.map(p => p.upper),
          borderColor: 'rgba(231, 74, 59, 0.5)',
          backgroundColor: 'rgba(231, 74, 59, 0.1)',
          borderWidth: 1,
          borderDash: [5, 5],
          pointRadius: 0,
          fill: {
            target: '-1',
            above: 'rgba(231, 74, 59, 0.1)'
          }
        }
      ]
    };
  }

  private get chartOptions(): ChartOptions<'line'> {
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 300
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: (context) => {
              const label = context.dataset.label || '';
              const value = context.parsed.y;
              const pred = this.predictions[context.dataIndex];
              
              if (label.includes('Intervalle')) {
                return `${label}: ${pred.lower.toFixed(0)} - ${pred.upper.toFixed(0)}`;
              }
              return `${label}: ${value.toFixed(0)}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Nombre de dons prévus',
            font: {
              weight: 'bold'
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Date',
            font: {
              weight: 'bold'
            }
          },
          grid: {
            display: false
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    };
  }
}
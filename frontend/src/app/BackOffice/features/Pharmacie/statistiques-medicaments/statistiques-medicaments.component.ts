import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { MedicamentService } from 'src/app/services/medicament/medicament.service';
import { Medicament } from 'src/app/models/models_pharma/medicament.model';

@Component({
  selector: 'app-statistiques-medicaments',
  templateUrl: './statistiques-medicaments.component.html',
  styleUrls: ['./statistiques-medicaments.component.css']
})
export class StatistiquesMedicamentsComponent implements OnInit {
  medicaments: Medicament[] = [];

  chartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Répartition des médicaments par catégorie'
      }
    }
  };

  chartType: 'pie' = 'pie';

  pieChartData: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: [{ data: [] }]
  };

  constructor(private medicamentService: MedicamentService) {}

  ngOnInit(): void {
    this.medicamentService.getAll().subscribe((data: Medicament[]) => {
      this.medicaments = data;
      this.genererStatistiques();
    });
  }

  genererStatistiques(): void {
    const stats: { [categorie: string]: number } = {};

    this.medicaments.forEach(med => {
      const cat = med.categorie || 'Non spécifiée';
      stats[cat] = (stats[cat] || 0) + 1;
    });

    this.pieChartData = {
      labels: Object.keys(stats),
      datasets: [
        {
          data: Object.values(stats)
        }
      ]
    };
  }
}

import { Component } from '@angular/core';
import { DonService } from "../../../../FrontOffice/features/User/services/services/don-service.service";
import { GroupeSanguin } from 'src/app/models/don.model';
@Component({
  selector: 'app-dons-stats',
  templateUrl: './dons-stats.component.html',
  styleUrls: ['./dons-stats.component.css']
})
export class DonsStatsComponent {
  predictions: any[] = [];
  bloodGroups = Object.values(GroupeSanguin);
  selectedBloodGroup: GroupeSanguin = GroupeSanguin.O_NEGATIF;
  daysAhead = 10;
  isLoading = false;
  errorMessage = '';

  constructor(private donService: DonService) {}

  ngOnInit(): void {
    this.loadPredictions();
  }

  loadPredictions(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.donService.getPredictions('SANG', this.selectedBloodGroup, this.daysAhead)
      .subscribe({
        next: (response) => {
          this.predictions = this.transformResponse(response);
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors du chargement des prédictions';
          this.isLoading = false;
          console.error(err);
        }
      });
  }

  onBloodGroupChange(): void {
    this.loadPredictions();
  }

  private transformResponse(response: any): any[] {
    return response.dates.map((date: string, index: number) => ({
      date,
      prediction: response.predictions[index],
      lower: response.confidence_interval.lower[index],
      upper: response.confidence_interval.upper[index]
    }));
  }
}

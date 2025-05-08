import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PredictionService } from '../../../../services/prediction-service.service';
import { PredictionResponseDTO } from '../../../../models/PredictionResponseDTO ';

@Component({
  selector: 'app-prediction-component',
  templateUrl: './prediction-component.component.html',
  styleUrls: ['./prediction-component.component.css']
})
export class PredictionComponentComponent implements OnInit {
  prediction?: PredictionResponseDTO;
  participationId?: number;
  errorMessage: string | null = null;

  constructor(
    private predictionService: PredictionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadParticipationId();
  }

  private loadParticipationId(): void {
    // Get participationId from route parameters
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam; // Convert string to number
      if (!isNaN(id) && id > 0) {
        this.participationId = id;
        this.getPrediction();
      } else {
        this.errorMessage = 'ID de participation invalide.';
        console.error('Invalid participationId:', idParam);
      }
    } else {
      this.errorMessage = 'Aucun ID de participation fourni dans l’URL.';
      console.error('No participationId provided in URL');
    }
  }

  getPrediction(): void {
    if (!this.participationId) {
      this.errorMessage = 'ID de participation non défini.';
      console.error('participationId is undefined');
      return;
    }

    this.predictionService.predictAttendance(this.participationId).subscribe({
      next: (data) => {
        console.log('Prédiction reçue :', data);
        this.prediction = data;
        this.errorMessage = null; // Clear any previous errors
      },
      error: (error) => {
        console.error('Erreur lors de la récupération de la prédiction :', error);
        this.errorMessage = error.error?.message || 'Erreur lors de la récupération de la prédiction.';
      }
    });
  }
}
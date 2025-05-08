
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PredictionResponseDTO } from '../models/PredictionResponseDTO ';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {

  private apiUrl = 'http://localhost:8081/api/v1/api/predictions'; // ton backend

  constructor(private http: HttpClient) {}

  predictAttendance(participationId: number): Observable<PredictionResponseDTO> {
    return this.http.get<PredictionResponseDTO>(`${this.apiUrl}/predict-attendance/${participationId}`);
  }
}





























/*import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Participation } from '../models/Participation';
import { environment } from '../../environments/environment';

export interface PredictionResponse {
  participantId: number;
  evenementId: number;
  prix: number;
  salle: number;
  lieu: number;
  nom: string;
  prixPaye: number;
  statut: number;
  typeEngagement: number;
  role: number;
  typeParticipant: number;
  attendanceLikelihood: number;
  predictedAttendance: boolean;
  suggestions: string[];
}

@Injectable({
  providedIn: 'root'
})
export class PredictionService {
  private apiUrl = `http://localhost:8080/spring2/api/predictions/predict-attendance`;

  constructor(private http: HttpClient) {}

  predictAttendance(participation: Participation): Observable<PredictionResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const inputDTO = this.mapToParticipantInputDTO(participation);

    return this.http.post<PredictionResponse>(this.apiUrl, inputDTO, { headers }).pipe(
      map(response => ({
        ...response,
        attendanceLikelihood: response.attendanceLikelihood * 100 // Convert to percentage
      })),
      catchError(error => {
        console.error('Error calling prediction API:', error);
        return throwError(() => new Error('Failed to fetch prediction: ' + error.message));
      })
    );
  }

  private mapToParticipantInputDTO(participation: Participation) {
    const participant = participation.engagement;
    const evenement = participation.evenement;

    return {
      participant_id: participant.id,
      evenement_id: evenement.id,
      prix: evenement.prix || 0,
      salle: this.mapSalleToCategory(evenement.salle?.nom),
      lieu: this.mapLieuToCategory(evenement.lieu?.nom),
      nom: evenement.nom || 'Unknown Event',
      prix_paye: participation.prixPaye || 0,
      statut: participation.statut || 'INSCRIT',
      type_engagement: participant.typeEngagement || 'INFORMEL',
      role: participant.role || 'PART;PARTICIPANT',
      type_participant: participant.type || 'ENREGISTRE'
    };
  }

  private mapSalleToCategory(salle: string | undefined): string {
    if (!salle) return 'Salle A';
    const lowerSalle = salle.toLowerCase();
    if (lowerSalle.includes('salle a')) return 'Salle A';
    if (lowerSalle.includes('salle b')) return 'Salle B';
    if (lowerSalle.includes('salle c')) return 'Salle C';
    if (lowerSalle.includes('salle d')) return 'Salle D';
    return 'Salle A';
  }

  private mapLieuToCategory(lieu: string | undefined): string {
    if (!lieu) return 'Centre Ville';
    const lowerLieu = lieu.toLowerCase();
    if (lowerLieu.includes('centre') || lowerLieu.includes('ville')) return 'Centre Ville';
    if (lowerLieu.includes('campus')) return 'Campus';
    if (lowerLieu.includes('parc')) return 'Parc';
    if (lowerLieu.includes('hotel')) return 'Hotel';
    return 'Centre Ville';
  }
}*/
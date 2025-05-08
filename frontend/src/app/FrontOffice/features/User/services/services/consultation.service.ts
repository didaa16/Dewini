import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, tap, map } from 'rxjs/operators';
import { Consultation } from '../../../../../models/consultation.model';
import { environment } from '../../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {
  private apiUrl = `${environment.apiBaseUrl}/consultation`;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    console.error('Une erreur s\'est produite:', error);
    let errorMessage = 'Une erreur est survenue lors de la communication avec le serveur.';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Erreur côté client: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Erreur serveur (Code: ${error.status}): ${error.error?.message || error.message}`;
    }
    return throwError(() => new Error(errorMessage)); // Throw a new Error with the message
  }

  getAllConsultations(): Observable<Consultation[]> {
    return this.http.get<Consultation[]>(`${this.apiUrl}/retrieve-all-consultations`, this.httpOptions).pipe(
      map(consultations => consultations.map(consultation => {
        if (consultation.date && !consultation.date.includes('/')) {
          const dateObj = new Date(consultation.date);
          consultation.date = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
        }
        if (consultation.heure && !consultation.heure.includes(':')) {
          consultation.heure = consultation.heure.padStart(4, '0').replace(/^(\d{2})(\d{2})$/, '$1:$2');
        }
        return consultation;
      })),
      retry(2), // Retry up to 2 times before failing
      catchError(this.handleError)
    );
  }

  getConsultationById(id: number): Observable<Consultation> {
    return this.http.get<Consultation>(`${this.apiUrl}/retrieve-consultation/${id}`, this.httpOptions).pipe(
      tap(consultation => console.log('Consultation récupérée:', consultation)),
      catchError(this.handleError)
    );
  }

  getConsultationsByDossierId(dossierId: number): Observable<Consultation[]> {
    return this.http.get<Consultation[]>(`${this.apiUrl}/retrieve-consultations-by-dossier/${dossierId}`, this.httpOptions).pipe(
      tap(consultations => console.log('Consultations du dossier récupérées:', consultations)),
      catchError(this.handleError)
    );
  }

  createConsultation(consultation: Consultation, userId: number): Observable<Consultation> {
    const payload = {
      date: consultation.date,
      heure: consultation.heure,
      medecin: { id: userId }, // ID du médecin connecté
      patient: { id: consultation.patient_id }, // ID du patient sélectionné
      dossierMedical: { id_dossier: consultation.dossierMedical_id },
      rapport: consultation.rapport,
      recommandations: consultation.recommandations
    };
  
    return this.http.post<Consultation>(
      `${this.apiUrl}/add-consultation/${userId}`,
      payload,
      this.httpOptions
    );
  }
  updateConsultation(consultation: Consultation): Observable<Consultation> {
    const payload = {
      id_consultation: consultation.id_consultation,
      date: consultation.date,
      heure: consultation.heure,
      medecin: { id: consultation.medecin?.id }, // Garder le même médecin
      patient: { id: consultation.patient_id }, // Utiliser patient_id comme pour la création
      dossierMedical: { id_dossier: consultation.dossierMedical_id },
      rapport: consultation.rapport || '',
      recommandations: consultation.recommandations || ''
    };

    return this.http.put<Consultation>(`${this.apiUrl}/modify-consultation`, payload, this.httpOptions).pipe(
      tap(updatedConsultation => console.log('Consultation mise à jour:', updatedConsultation)),
      catchError(this.handleError)
    );
  }

  deleteConsultation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove-consultation/${id}`, this.httpOptions).pipe(
      tap(() => console.log('Consultation supprimée:', id)),
      catchError(this.handleError)
    );
  }
}

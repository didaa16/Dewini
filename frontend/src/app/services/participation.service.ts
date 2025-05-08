import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Participation } from '../models/Participation';

@Injectable({
  providedIn: 'root'
})
export class ParticipationService {
  private apiUrl = 'http://localhost:8081/api/v1/participation';

  constructor(private http: HttpClient) { }

  // Formulaire d'inscription
  registerForEvent(participation: Participation): Observable<Participation> {
    return this.http.post<Participation>(this.apiUrl, participation);
  }

  getParticipationById(id: number): Observable<Participation> {
    return this.http.get<Participation>(`${this.apiUrl}/retrieve-participation/${id}`);
     
    
  }
 

  getParticipationsByEvenement(evenementId: number): Observable<Participation[]> {
    return this.http.get<Participation[]>(`${this.apiUrl}/evenement/${evenementId}`);
  }
 

  // Historique utilisateur (doublon possible mais utile)
  getUserParticipations(userId: number): Observable<Participation[]> {
    return this.http.get<Participation[]>(`${this.apiUrl}/user/${userId}`);
  }

  // Modifier la participation (check-in, présence, évaluation, paiement...)
  updateParticipation(id: number, participation: Participation): Observable<Participation> {
    return this.http.put<Participation>(`${this.apiUrl}/modify-participation`, participation);
  }

  // Annulation (admin ou user)
  cancelParticipation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove-participation/${id}`);
  }
  getAll(): Observable<Participation[]> {
    return this.http.get<Participation[]>(`${this.apiUrl}/retrieve-all-participations`);
  }

  // ✅ Nouvelle méthode : annulation avec remboursement automatique
  cancelWithRefund(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/annuler`, {});
  }

  // ✅ Nouvelle méthode : check-in
  checkIn(participationId: number): Observable<Participation> {
    return this.http.put<Participation>(`${this.apiUrl}/${participationId}/checkin`, {});
  }

  // ✅ Nouvelle méthode : stats pour tableau de bord admin
  getStatsByEvent(eventId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }
  getParticipationStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }
  // ✅ Nouvelle méthode : export des participations en Excel
  exportParticipationsToExcel(eventId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/event/${eventId}/export`, { responseType: 'blob' });
  }

  createParticipation(participation: Partial<Participation>) {
    return this.http.post<Participation>(this.apiUrl, participation);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evenement } from '../models/evenement';
import { Participant } from '../models/participant';
//import { Speaker } from '../../models/speaker.model';
//import { Payment } from '../../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'https://your-api-url.com/api/admin';

  constructor(private http: HttpClient) { }

  // Gestion des événements
  createEvent(event: Evenement): Observable<Event> {
    return this.http.post<Event>(`${this.apiUrl}/events`, event);
  }

  updateEvent(eventId: string, event: Event): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/events/${eventId}`, event);
  }

  deleteEvent(eventId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/events/${eventId}`);
  }

  // Participants
  getParticipants(filters?: any): Observable<Participant[]> {
    return this.http.get<Participant[]>(`${this.apiUrl}/participants`, { params: filters });
  }

  checkInParticipant(eventId: string, participantId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/events/${eventId}/checkin/${participantId}`, {});
  }

  // Statistiques
  getEventStatistics(eventId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/events/${eventId}/statistics`);
  }

  // Intervenants
  /*getSpeakers(): Observable<Speaker[]> {
    return this.http.get<Speaker[]>(`${this.apiUrl}/speakers`);
  }

  addSpeaker(speaker: Speaker): Observable<Speaker> {
    return this.http.post<Speaker>(`${this.apiUrl}/speakers`, speaker);
  }

  // Paiements
  getPayments(eventId?: string): Observable<Payment[]> {
    const url = eventId ? `${this.apiUrl}/payments?eventId=${eventId}` : `${this.apiUrl}/payments`;
    return this.http.get<Payment[]>(url);
  }*/
}
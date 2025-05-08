import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Evenement } from '../models/evenement';
import { Participation } from '../models/Participation';
import { Participant } from '../models/participant';
import { Page } from '../models/Page';
import { ParticipantFilter } from '../models/ParticipantFilter';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ParticipantService {
  private apiUrl = 'http://localhost:8080/8081/api/v1/event-engagement';

  constructor(private http: HttpClient) {}

  // Dashboard utilisateur
  getUpcomingEvents(userId: number): Observable<Evenement[]> {
    return this.http.get<Evenement[]>(`${this.apiUrl}/${userId}/upcoming-events`);
  }

  getParticipationHistory(userId: number): Observable<Participation[]> {
    return this.http.get<Participation[]>(`${this.apiUrl}/${userId}/history`);
  }

  // Évaluation
  submitEvaluation(evaluation: any): Observable<Participation> {
    return this.http.put<Participation>(`${this.apiUrl}/evaluate`, evaluation);
  }

  // Supports pédagogiques
  getEventMaterials(eventId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/events/${eventId}/materials`);
  }
  registerForEvent(data: { evenementId: number, participant: Partial<Participant> }): Observable<Participation> {
    return this.http.post<Participation>(`${this.apiUrl}/register/${data.evenementId}`, data.participant);
  }
  /*createParticipant(participant: Partial<Participant>) {
    return this.http.post<Participant>(this.apiUrl, participant);
  }*/
    getParticipants(filter: ParticipantFilter): Observable<Page<Participant>> {
      let params = new HttpParams();
  
      for (const [key, value] of Object.entries(filter)) {
        if (value !== undefined && value !== null) {
          params = params.set(key, String(value));
        }
      }
  
      return this.http.get<Page<Participant>>(this.apiUrl, { params });
    }
  
    getParticipant(id: number): Observable<Participant> {
      return this.http.get<Participant>(`${this.apiUrl}/retrieve-engagement/${id}`);
    }
    createParticipant(participant: Participant): Observable<Participant> {
      return this.http.post<Participant>(`${this.apiUrl}/add-engagement`, participant);
    }
    /*createParticipant(participant: Omit<Participant, 'id'>): Observable<Participant> {
      return this.http.post<Participant>(`${this.apiUrl}/get`, participant);
    }*/
  
    updateParticipant(id: number, participant: Partial<Participant>): Observable<Participant> {
      return this.http.patch<Participant>(`${this.apiUrl}/${id}`, participant);
    }
  
    deleteParticipant(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/remove-engagement/${id}`);
    }
  
    generateBadge(id: number): Observable<{ badgeUrl: string }> {
      return this.http.post<{ badgeUrl: string }>(`${this.apiUrl}/${id}/badge`, {});
    }
  
    exportParticipants(ids: number[]): Observable<Blob> {
      return this.http.post(`${this.apiUrl}/export`, { ids }, { responseType: 'blob' });
    }



}

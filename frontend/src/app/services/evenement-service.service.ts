import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Evenement } from '../models/evenement';
import { Participant } from '../models/participant';
import { Participation } from '../models/Participation';
import { WeatherInfo } from '../models/WeatherInfo';
import {AuthenticationService} from "../FrontOffice/features/User/services/services/authentication.service";
@Injectable({
  providedIn: 'root'
})
export class EvenementService {
  private baseUrl = 'http://localhost:8081/api/v1/evenement';

  constructor(private http: HttpClient, private authService: AuthenticationService) { }
  ajusterLieuEvenement(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/ajuster-salle`, {});
  }
  getMeteo(evenementId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/${evenementId}/meteo`);
  }
  // Correspondance exacte avec le backend
  retrieveAllEvenements(): Observable<Evenement[]> {
    return this.http.get<Evenement[]>(`${this.baseUrl}/retrieve-all-evenements`);
  }
  adjustEvent(id: number): Observable<string> {
    return this.http.post(`${this.baseUrl}/${id}/adjust`, {}, { responseType: 'text' });
  }

  getWeatherForEvent(id: number): Observable<WeatherInfo> {
    return this.http.get<WeatherInfo>(`${this.baseUrl}/${id}/weather`);
  }
  retrieveEvenementById(id: number): Observable<Evenement> {
    return this.http.get<Evenement>(`${this.baseUrl}/retrieve-evenement/${id}`);
  }

  addEvenement(evenement: Evenement): Observable<Evenement> {
    return this.http.post<Evenement>(`${this.baseUrl}/add-evenement`, evenement);
  }

  modifyEvenement(id: number, evenement: Evenement): Observable<Evenement> {
    return this.http.put<Evenement>(`${this.baseUrl}/modify-evenement/${id}`, evenement);
  }


  removeEvenement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/remove-evenement/${id}`);
  }
  getParticipationsByEvent(eventId: number): Observable<Participation[]> {
    return this.http.get<any[]>(`${this.baseUrl}/event/${eventId}`).pipe(
      map(response => response.map(this.mapToParticipation))
    );
  }

  private mapToParticipation(data: any): Participation {
    return {
      id: data.id,
      evenement: {
        id: data.evenement.id,
        nom: data.evenement.nom,
        dateDebut: new Date(data.evenement.dateDebut),
        dateFin: new Date(data.evenement.dateFin),
        description: data.evenement.description,
        prix: data.evenement.prix,
        seuilMinimum: data.evenement.seuilMinimum,
        lieu: data.evenement.lieu,
        salle: data.evenement.salle,
        coordonnees: data.evenement.coordonnees
      },
      engagement: {
        id: data.engagement.id,
        evenement: null!, // Not included in response, set to null
        dateEngagement: new Date(), // Not provided, use current date as fallback
        typeEngagement: data.engagement.typeEngagement,
        role: data.engagement.role,
        type: data.engagement.type,
        userId : this.authService.getCurrentUserId(),
      },
      statut: data.statut,
      dateInscription: new Date(data.dateInscription),
      presence: data.presence,
      prixPaye: data.prixPaye,
      evaluationNote: data.evaluationNote,
      commentaire: data.commentaire
    };
  }
  // Méthodes supplémentaires
  getUpcomingEvents(): Observable<Evenement[]> {
    return this.http.get<Evenement[]>(`${this.baseUrl}/upcoming`).pipe(
      map(events => events.map(event => ({
        ...event,
        dateDebut: new Date(event.dateDebut),
        dateFin: new Date(event.dateFin)
      })))
    );
  }


  getEventParticipants(eventId: number): Observable<Participant[]> {
    return this.http.get<Participant[]>(`${this.baseUrl}/${eventId}/participants`);
  }
  getEventDetails(id: number): Observable<Evenement> {
    return this.http.get<Evenement>(`${this.baseUrl}/${id}`);
  }

  getEventsWithCoordinates(): Observable<Evenement[]> {
    return this.http.get<Evenement[]>(`${this.baseUrl}/with-coordinates`);
  }



  getNearbyEvents(lat: number, lng: number, radius: number = 10): Observable<Evenement[]> {
    return this.http.get<Evenement[]>(
      `${this.baseUrl}/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
    );
  }

  updateEventCoordinates(id: number, lat: number, lng: number): Observable<Evenement> {
    return this.http.put<Evenement>(
      `${this.baseUrl}/${id}/coordinates?lat=${lat}&lng=${lng}`,
      {}
    );
  }

  // Anciens noms gardés pour référence (à supprimer éventuellement)
  /*
  getAllEvents(): Observable<Evenement[]> {
    return this.retrieveAllEvenements();
  }

  getEventDetails(id: number): Observable<Evenement> {
    return this.retrieveEvenementById(id);
  }

  createEvent(event: Evenement): Observable<Evenement> {
    return this.addEvenement(event);
  }

  updateEvent(id: number, event: Evenement): Observable<Evenement> {
    return this.modifyEvenement(event); // Note: L'ID est déjà dans l'objet event
  }

  deleteEvent(id: number): Observable<void> {
    return this.removeEvenement(id);
  }
  */
}


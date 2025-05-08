import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reponse } from 'src/app/models/ModelsRendezvous/Reponse';

@Injectable({
  providedIn: 'root'
})
export class ReponseService {
  private apiUrl = 'http://localhost:8081/api/v1/api/reponses';

  constructor(private http: HttpClient) {}

  getReponsesByRendezvousId(rendezvousId: number): Observable<Reponse[]> {
    return this.http.get<Reponse[]>(`${this.apiUrl}/rendezvous/${rendezvousId}`);
  }

  createReponse(reponse: Reponse): Observable<Reponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Reponse>(`${this.apiUrl}`, reponse, { headers });
  }

  updateReponse(id: number, reponse: Reponse): Observable<Reponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Reponse>(`${this.apiUrl}/${id}`, reponse, { headers });
  }

  deleteReponse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  checkIfResponseExists(rendezvousId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/exists/${rendezvousId}`);
  }

  updateResponseStatus(id: number, etat: string): Observable<Reponse> {
    return this.http.put<Reponse>(`${this.apiUrl}/${id}/etat?etat=${etat}`, {});
  }

  getResponseStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/count`);
  }

  getRendezVousStats(): Observable<any> {
  return this.http.get(`${this.apiUrl}/stats/rendezvous`);
}
createReponseWithSms(reponse: Reponse): Observable<Reponse> {
  return this.http.post<Reponse>(`${this.apiUrl}/with-sms`, reponse);
}
}

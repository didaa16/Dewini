import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Salle } from '../models/Salle';

@Injectable({
  providedIn: 'root'
})
export class SalleService {

  private apiUrl = '/api/salles'; // L'URL pour accéder aux salles dans le backend

  constructor(private http: HttpClient) { }

  getSalles(): Observable<Salle[]> {
    return this.http.get<Salle[]>(this.apiUrl);
  }

  getSalleById(id: number): Observable<Salle> {
    return this.http.get<Salle>(`${this.apiUrl}/${id}`);
  }
}

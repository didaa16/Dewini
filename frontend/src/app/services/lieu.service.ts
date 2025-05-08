import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lieu } from '../models/Lieu';

@Injectable({
  providedIn: 'root'
})
export class LieuService {
  private apiUrl = 'http://localhost:8081/api/v1/api/lieux';
  constructor(private http: HttpClient) { }

  getLieux(): Observable<Lieu[]> {
    return this.http.get<Lieu[]>(this.apiUrl);
  }

  getLieuById(id: number): Observable<Lieu> {
    return this.http.get<Lieu>(`${this.apiUrl}/${id}`);
  }
}

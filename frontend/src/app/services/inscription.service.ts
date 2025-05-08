import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class InscriptionService {
  private API = `${environment.apiUrl}/api/inscriptions/inscrire`;

  constructor(private http: HttpClient) {}

  inscrire(data: any): Observable<{ requiresPayment: boolean, paymentUrl?: string }> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('jwt_token')}` // Adjust based on your token storage
    });
    return this.http.post<{ requiresPayment: boolean, paymentUrl?: string }>(this.API, data, { headers });
  }
}

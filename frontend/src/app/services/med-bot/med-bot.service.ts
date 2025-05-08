import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedBotService {

  // Make sure this URL matches your backend
  private apiUrl = 'http://localhost:8081/api/v1/api/ask';

  constructor(private http: HttpClient) {}

  getMedBotResponse(question: string): Observable<string> {
    return this.http.post<string>(this.apiUrl, { question }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

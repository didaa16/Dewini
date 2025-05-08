import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

interface DrBertResponse {
  label: string;
  score: number;
}

@Injectable({
  providedIn: 'root'
})
export class DiagnosticService {

  private apiUrl = 'http://localhost:8081/api/v1/api/diagnostic/analyze';

  constructor(private http: HttpClient) { }

  analyzeText(text: string): Observable<DrBertResponse[]> {
    const params = new HttpParams().set('text', text);
    return this.http.get<DrBertResponse[]>(this.apiUrl, { params });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DateSuggestionResponse } from '../models/DateSuggestionResponse ';
import { EventDateSuggestionRequest } from '../models/EventDateSuggestionRequest';

@Injectable({
  providedIn: 'root'
})
export class PlanningService {
  private apiUrl = 'http://localhost:8081/api/v1/api/planning/suggest-best-date'; // Corrected to match backend endpoint

  constructor(private http: HttpClient) {}

  suggestBestDate(payload: EventDateSuggestionRequest): Observable<DateSuggestionResponse> {
    console.log('Calling backend endpoint:', this.apiUrl);
    return this.http.post<DateSuggestionResponse>(this.apiUrl, payload);
  }
}
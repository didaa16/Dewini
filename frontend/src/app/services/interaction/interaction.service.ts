import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InteractionService {
  private apiUrl = 'https://api.fda.gov/drug/label.json';

  constructor(private http: HttpClient) {}

  // Charge les données de plusieurs médicaments en parallèle
  getDrugDataFromFDA(ingredients: string[]): Observable<any[]> {
    const requests = ingredients.map(ing =>
      this.http.get<any>(`${this.apiUrl}?search=active_ingredient:${ing}`)
    );
  
    return forkJoin(requests).pipe(
      map(responses => responses.map((res, i) => ({
        ingredient: ingredients[i],
        data: res?.results?.[0] || null
      })))
    );
  }
  
  
}

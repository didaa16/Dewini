import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FdaService {
  private apiUrl = 'https://api.fda.gov/drug/label.json';

  constructor(private http: HttpClient) {}

  getDrugInfoByIngredient(ingredient: string): Observable<any> {
    const query = `?search=active_ingredient:${ingredient}`;
    return this.http.get<any>(`${this.apiUrl}${query}`);
  }
}

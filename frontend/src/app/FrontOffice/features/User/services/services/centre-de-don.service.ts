import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { CentreDeDon } from '../../../../../models/centre-de-don.model';
import {environment} from "../../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CentreDeDonService {
  private apiUrl = `${environment.apiBaseUrl}/centre-de-don`;

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      errorMessage = `Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  getAllCentres(): Observable<CentreDeDon[]> {
    return this.http.get<CentreDeDon[]>(`${this.apiUrl}/retrieve-all-centres`)
      .pipe(catchError(this.handleError));
  }

  getCentreById(id: number): Observable<CentreDeDon> {
    return this.http.get<CentreDeDon>(`${this.apiUrl}/retrieve-centre/${id}`)
      .pipe(catchError(this.handleError));
  }

  addCentre(centre: Omit<CentreDeDon, 'idCentre'>): Observable<CentreDeDon> {
    return this.http.post<CentreDeDon>(`${this.apiUrl}/add-centre`, centre)
      .pipe(catchError(this.handleError));
  }

  updateCentre(centre: CentreDeDon): Observable<CentreDeDon> {
    return this.http.put<CentreDeDon>(`${this.apiUrl}/modify-centre`, centre)
      .pipe(catchError(this.handleError));
  }

  deleteCentre(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove-centre/${id}`)
      .pipe(catchError(this.handleError));
  }
}

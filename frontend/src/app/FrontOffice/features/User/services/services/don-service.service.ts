import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Don, State } from '../../../../../models/don.model';
import {environment} from "../../../../../../environments/environment";
import {User} from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class DonService {
  private apiUrl = `${environment.apiBaseUrl}/dons`;
  private userApiUrl = `${environment.apiBaseUrl}/user`

  constructor(private http: HttpClient) {}

  getAllDons(): Observable<Don[]> {
    return this.http.get<Don[]>(`${this.apiUrl}/retrieve-all-dons`).pipe(
      catchError(this.handleError)
    );
  }

  getDonByAdress(id: number | null): Observable<Don[]> {
    return this.http.get<Don[]>(`${this.apiUrl}/dons-voisins/${id}`);
  }

  addDon(don: Don): Observable<Don> {
    return this.http.post<Don>(`${this.apiUrl}/add-don`, don);
  }
  updateDon(don: Don): Observable<Don> {
    const url = `${this.apiUrl}/modify-don/${don.idDon}`; // Correspond à @PutMapping("/modify-don/{don-id}")

    console.log('URL appelée:', url); // Pour debug

    return this.http.put<Don>(url, don, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      catchError(error => {
        console.error('Erreur:', error);
        return throwError(() => error);
      })
    );
  }


  deleteDon(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove-don/${id}`);
  }

  getDonById(id: number): Observable<Don> {
    return this.http.get<Don>(`${this.apiUrl}/retrieve-don/${id}`);
  }

  assignDon(idDon: number, donorData: User): Observable<Don> {
    return this.http.put<Don>(`${this.apiUrl}/assign-don/${idDon}`, donorData);
  }

  getDonorById(id: number): Observable<User> {
    return this.http.get<User>(`${this.userApiUrl}/retrieve-user/${id}`);
  }

  addDonneurToDon(donId: number, userId: number | null): Observable<Don> {
    return this.http.post<Don>(
      `${this.apiUrl}/${donId}/donneurs/${userId}`,
      {}
    ).pipe(
      catchError(this.handleError)
    );
  }

  updateDonneurState(donId: number, utilisateurId: number | undefined, newState: State): Observable<Don> {
    return this.http.put<Don>(
      `${this.apiUrl}/absence/${donId}/donneurs/${utilisateurId}`,
      {},
      { params: { state: newState } }
    ).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Erreur:', error);
    return throwError(() => new Error('Une erreur est survenue'));
  }

  //STATS
  getPredictions(typeDon: string, grpSanguin: string, daysAhead: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}/predictions`, {
      params: {
        typeDon,
        grpSanguin,
        daysAhead: daysAhead.toString()
      }
    });
  }

}


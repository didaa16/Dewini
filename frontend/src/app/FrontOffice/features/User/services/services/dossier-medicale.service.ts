import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DossierMedicale } from '../../../../../models/dossier-medicale.model';
import { environment } from '../../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DossierMedicaleService {

  private apiUrl = `${environment.apiBaseUrl}/dossier`;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  private handleError(error: any) {
    console.error('Une erreur s\'est produite:', error);
    return throwError(() => error);
  }

  getAllDossiers(): Observable<DossierMedicale[]> {
    const url = `${this.apiUrl}/retrieve-all-dossiers`;
    console.log('Calling URL:', url);
    return this.http.get<DossierMedicale[]>(url, this.httpOptions).pipe(
      tap(dossiers => console.log('Dossiers récupérés:', dossiers)),
      catchError(this.handleError)
    );
  }

  getDossier(id: number): Observable<DossierMedicale> {
    const url = `${this.apiUrl}/retrieve-dossier/${id}`;
    console.log('Calling URL:', url);
    return this.http.get<DossierMedicale>(url, this.httpOptions).pipe(
      tap(dossier => console.log('Dossier récupéré:', dossier)),
      catchError(this.handleError)
    );
  }

  createDossier(dossier: DossierMedicale): Observable<DossierMedicale> {
    const url = `${this.apiUrl}/add-dossier`;
    console.log('Calling URL:', url);
    console.log('Création du dossier avec les données:', dossier);
    return this.http.post<DossierMedicale>(url, dossier, this.httpOptions).pipe(
      tap(newDossier => console.log('Dossier créé:', newDossier)),
      catchError(this.handleError)
    );
  }

  updateDossier(dossier: DossierMedicale): Observable<DossierMedicale> {
    const url = `${this.apiUrl}/modify-dossier`;
    console.log('Calling URL:', url);
    return this.http.put<DossierMedicale>(url, dossier, this.httpOptions).pipe(
      tap(updatedDossier => console.log('Dossier mis à jour:', updatedDossier)),
      catchError(this.handleError)
    );
  }

  deleteDossier(id: number): Observable<void> {
    const url = `${this.apiUrl}/remove-dossier/${id}`;
    console.log('Calling URL:', url);
    return this.http.delete<void>(url, this.httpOptions).pipe(
      tap(() => console.log('Dossier supprimé avec l\'ID:', id)),
      catchError(this.handleError)
    );
  }

  getDossierByPatient(patientId: number): Observable<DossierMedicale> {
    const url = `${this.apiUrl}/retrieve-by-patient/${patientId}`;
    console.log('Calling URL:', url);
    return this.http.get<DossierMedicale>(url, this.httpOptions).pipe(
      tap(dossier => console.log('Dossier récupéré:', dossier)),
      catchError(this.handleError)
    );
  }
  analyserDossier(idDossier: number): Observable<string> {
    const url = `${this.apiUrl}/analyse-dossier/${idDossier}`;
    return this.http.get(url, { responseType: 'text' }).pipe(
      tap(response => console.log('Analyse IA reçue:', response)),
      catchError(this.handleError)
    );
  }

}

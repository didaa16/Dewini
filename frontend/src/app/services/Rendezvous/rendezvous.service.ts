import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { Rendezvous } from 'src/app/models/ModelsRendezvous/Rendezvous';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class RendezvousService {
  // Correction: Supprimer le doublon '/api' dans l'URL
  private baseUrl = 'http://localhost:8081/api/v1/api/rendezvous';
  private rendezvousListSubject = new BehaviorSubject<Rendezvous[]>([]);
  public rendezvousList$ = this.rendezvousListSubject.asObservable();
  
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur client: ${error.error.message}`;
    } else {
      errorMessage = `Erreur serveur: ${error.status} - ${error.message}`;
      if (error.error && error.error.message) {
        errorMessage += ` | Détails: ${error.error.message}`;
      }
    }
    console.error('Erreur complète:', error);
    return throwError(() => new Error(errorMessage));
  }

  // Correction des méthodes pour matcher le backend

  getAllRendezvous(): Observable<Rendezvous[]> {
    return this.http.get<Rendezvous[]>(this.baseUrl, this.httpOptions).pipe(
      tap(data => this.rendezvousListSubject.next(data)),
      catchError(this.handleError)
    );
  }

  getRendezvousById(id: number): Observable<Rendezvous> {
    return this.http.get<Rendezvous>(`${this.baseUrl}/${id}`, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  // Correction: Ajout de l'idUser dans l'URL
  createRendezvous(rendezvous: Rendezvous, idUser: number): Observable<Rendezvous> {
    return this.http.post<Rendezvous>(
      `${this.baseUrl}/${idUser}`,
      JSON.stringify(rendezvous),
      this.httpOptions
    ).pipe(
      tap(newRdv => this.addLocalRendezvous(newRdv)),
      catchError(this.handleError)
    );
  }
  updateRendezvous(idRendezvous: number, idUser: number, rendezvous: Rendezvous): Observable<Rendezvous> {
    // Log des données envoyées
    console.log('Envoi de la mise à jour:', {
      idRendezvous,
      idUser,
      rendezvous
    });
  
    return this.http.put<Rendezvous>(
      `${this.baseUrl}/${idRendezvous}`, // Retirez /user/${idUser} si le backend ne l'attend pas
      rendezvous, // HttpClient gère déjà la sérialisation JSON
      this.httpOptions
    ).pipe(
      tap(response => console.log('Réponse du serveur:', response)),
      catchError(error => {
        console.error('Erreur détaillée:', error);
        return throwError(() => error);
      })
    );
  }
  deleteRendezvous(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, this.httpOptions).pipe(
      tap(() => this.removeLocalRendezvous(id)),
      catchError(this.handleError)
    );
  }

  checkAvailability(date: Date, time: string): Observable<boolean> {
    const formattedDate = formatDate(date, 'yyyy-MM-dd', 'en-US');
    return this.http.get<boolean>(`${this.baseUrl}/disponibilite`, {
      ...this.httpOptions,
      params: { date: formattedDate, heure: time }
    }).pipe(
      catchError(this.handleError)
    );
  }

  getSuggestedSlots(date: Date, time: string): Observable<string[]> {
    const formattedDate = formatDate(date, 'yyyy-MM-dd', 'en-US');
    return this.http.get<string[]>(`${this.baseUrl}/suggestions`, {
      ...this.httpOptions,
      params: { date: formattedDate, heure: time }
    }).pipe(
      catchError(this.handleError)
    );
  }

  private isValidEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  debugBackend(): Observable<string> {
    return this.http.get(`${this.baseUrl}/debug`, { 
      responseType: 'text' 
    }).pipe(
      catchError(this.handleError)
    );
  }

  sendReminders(): Observable<any> {
    return this.http.post(`${this.baseUrl}/send-reminders`, {}, {
      ...this.httpOptions,
      responseType: 'text'
    }).pipe(
      map(() => ({ success: true })),
      catchError(this.handleError)
    );
  }

  // Méthodes pour la gestion locale
  loadRendezvous(): void {
    this.getAllRendezvous().subscribe({
      error: err => console.error('Erreur de chargement', err)
    });
  }

  addLocalRendezvous(rdv: Rendezvous): void {
    const current = this.rendezvousListSubject.getValue();
    this.rendezvousListSubject.next([...current, rdv]);
  }

  removeLocalRendezvous(id: number): void {
    const current = this.rendezvousListSubject.getValue();
    this.rendezvousListSubject.next(current.filter(r => r.idRendezvous !== id));
  }

  updateLocalRendezvous(updated: Rendezvous): void {
    const current = this.rendezvousListSubject.getValue();
    this.rendezvousListSubject.next(
      current.map(r => r.idRendezvous === updated.idRendezvous ? updated : r)
    );
  }
}
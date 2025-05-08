import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  sendConsultationLink(patientEmail: string, consultationLink: string): Observable<string> {
    const emailData = {
      to: patientEmail,
      subject: 'Lien de consultation vidéo',
      content: `Bonjour,\n\nVoici le lien pour rejoindre votre consultation vidéo : ${consultationLink}\n\nCordialement,\nVotre médecin`
    };

    return this.http.post(`${this.apiUrl}/email/send`, emailData, { responseType: 'text' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error sending email:', error);
          if (error.status === 200 && typeof error.error === 'string') {
            return of(error.error);
          }
          throw new Error(error.message || 'Une erreur est survenue lors de l\'envoi de l\'email');
        })
      );
  }
}

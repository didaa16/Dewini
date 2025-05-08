import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FatigueService {
  private flaskApiUrl = 'http://localhost:5002/api/scan-fatigue';
  private springApiUrl = 'http://localhost:8081/api/v1/api/fatigue';

  constructor(private http: HttpClient) {}

  // ✅ Lancer le scan via Flask
  lancerTestFatigue(): Observable<any> {
    return this.http.get<any>(this.flaskApiUrl);
  }

  // ✅ Envoyer le PDF généré au backend Spring Boot pour Cloudinary + WhatsApp
  envoyerPdfAvecWhatsapp(file: File, numeroPatient: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('numeroPatient', numeroPatient);

    return this.http.post(`${this.springApiUrl}/upload`, formData, {
      responseType: 'text'
    });
  }

  envoyerImageAvecWhatsapp(file: File, numeroPatient: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('numeroPatient', numeroPatient);
    return this.http.post(`${this.springApiUrl}/upload-image`, formData, { responseType: 'text' });
  }
  
  
}

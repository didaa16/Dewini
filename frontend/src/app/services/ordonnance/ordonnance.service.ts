import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Ordonnance } from 'src/app/models/models_pharma/ordonnance.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthenticationService, UserControllerService } from 'src/app/FrontOffice/features/User/services/services';

@Injectable({
  providedIn: 'root'
})
export class OrdonnanceService {

  private apiUrl = `${environment.apiBaseUrl}/api/ordonnances`;

  constructor(
    private http: HttpClient,
    private userService: AuthenticationService,
  ) {}

  getAll(): Observable<Ordonnance[]> {
    return this.http.get<Ordonnance[]>(this.apiUrl);
  }

  add(ordonnance: Ordonnance, patientId: number): Observable<any> {
    const connectedUserId = this.userService.getCurrentUser(); // Get current user ID
    
    const payload = {
        ...ordonnance,
        medecinId: { id: connectedUserId }, // Current user as doctor
        patientId: { id: patientId },       // Selected patient from form
        prescriptions: ordonnance.prescriptions.map(p => ({
            medicament: { id: p.medicament.id },
            posologie: p.posologie,
            duree: p.duree
        }))
    };
    return this.http.post(`${this.apiUrl}/${patientId}`, payload);
}

  getById(id: number): Observable<Ordonnance> {
    return this.http.get<Ordonnance>(`${this.apiUrl}/${id}`);
  }

  commander(id: number, nomClient: string, adresse: string) {
    const params = new HttpParams()
      .set('nomClient', nomClient)
      .set('adresse', adresse);

    return this.http.post(`${this.apiUrl}/${id}/commander`, null, { params });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  update(id: number, ordonnance: Ordonnance): Observable<any> {
    const payload = {
      ...ordonnance,
      medecinId: { id: ordonnance.medecinId }, // Just send the ID
      patientId: { id: ordonnance.patientId }, // Just send the ID
      prescriptions: ordonnance.prescriptions.map(p => ({
        medicament: { id: p.medicament.id },
        posologie: p.posologie,
        duree: p.duree
      }))
    };
    return this.http.put(`${this.apiUrl}/${id}`, payload);
  }

  ajouterCommentaire(id: number, commentaire: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/commentaire`, { commentaire });
  }
}

import { StatutUrgence, TypeUrgence, Urgence } from '../../../../../models/urgence';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {environment} from "../../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UrgenceService {
  private apiServerUrl = `${environment.apiBaseUrl}/urgence`;
  constructor(private http: HttpClient) {}

  getUrgences(): Observable<Urgence[]> {
    return this.http.get<Urgence[]>(`${this.apiServerUrl}/retrieve-all-urgences`);
  }

  getUrgencesByUser(id: number | null): Observable<Urgence[]> {
    return this.http.get<Urgence[]>(`${this.apiServerUrl}/retrieve-urgence-by-user/${id}`);
  }

  getUrgenceById(id: number): Observable<Urgence> {
    return this.http.get<Urgence>(`${this.apiServerUrl}/retrieve-urgence/${id}`);
  }

  getUrgencesWithoutTrated(): Observable<Urgence[]> {
    return this.http.get<Urgence[]>(`${this.apiServerUrl}/retrieve-all-urgences-without-treated`);
  }

  addUrgence(u: Urgence): Observable<Urgence> {
    return this.http.post<Urgence>(`${this.apiServerUrl}/add-urgence`, u);
  }

  deleteUrgence(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/remove-urgence/${id}`);
  }

  updateUrgence(u: Partial<Urgence>, id: number): Observable<Urgence> {
    return this.http.put<Urgence>(`${this.apiServerUrl}/modify-urgence/${id}`, u);
  }

  exportToExcel(): void {
    const url = `${this.apiServerUrl}/excel`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/octet-stream'
    });

    this.http.get(url, { responseType: 'blob', headers }).subscribe((response: Blob) => {
      const blob = new Blob([response], { type: 'application/vnd.ms-excel' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'Urgences.xls';
      link.click();
      window.URL.revokeObjectURL(link.href);
    }, (error) => {
      console.error('Error downloading Excel file:', error);
    });
  }

  desaffecterUtilisateurFromUrgence(idUrgence: number): Observable<void> {
    return this.http.put<void>(`${this.apiServerUrl}/desaffercter-utilisateur-from-urgence/${idUrgence}`, {});
  }

  getTreatedStats(period: string): Observable<number> {
    return this.http.get<number>(`${this.apiServerUrl}/stats/traitees?period=${period}`);
  }

  getTypeDistribution(): Observable<Map<TypeUrgence, number>> {
    return this.http.get<Map<TypeUrgence, number>>(`${this.apiServerUrl}/stats/repartition-type`);
  }

  getStatusRatio(): Observable<Map<StatutUrgence, number>> {
    return this.http.get<Map<StatutUrgence, number>>(`${this.apiServerUrl}/stats/ratio-statut`);
  }

  getUrgencesDomicileCoordinates(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiServerUrl}/urgences/domicile/coordinates`);
  }
}

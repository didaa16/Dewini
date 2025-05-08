import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Livraison } from 'src/app/models/models_pharma/livraison.model';


@Injectable({
  providedIn: 'root'
})
export class LivraisonService {
  private apiUrl = `${environment.apiUrl}/livraisons`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  deleteLivraison(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`, {
      responseType: 'text' as 'json' // ✅ important si le backend renvoie une string
    });
  }

  updateLivraison(id: number, livraison: Livraison): Observable<Livraison> {
    return this.http.put<Livraison>(`${this.apiUrl}/${id}`, livraison);
  }
  
  getLivraisonById(id: number): Observable<Livraison> {
    return this.http.get<Livraison>(`${this.apiUrl}/${id}`);
  }
  commanderDepuisPanier(payload: {
    patientId: number;
    nomClient: string;
    adresse: string;
    medicamentIds: number[];
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/commande/panier`, payload);
  }

  addLivraison(l: Livraison): Observable<Livraison> {
    return this.http.post<Livraison>(this.apiUrl, l); // ✅ Corrigé ici
  }
  
  
  
  
  
}

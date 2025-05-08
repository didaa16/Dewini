import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Medicament } from 'src/app/models/models_pharma/medicament.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MedicamentService {

  private apiUrl = `${environment.apiUrl}/medicaments`;

  constructor(private http: HttpClient) {}

  // 🔍 Liste tous les médicaments
  getAll(): Observable<Medicament[]> {
    return this.http.get<Medicament[]>(this.apiUrl);
  }

  // ➕ Ajouter un médicament
  add(medicament: Medicament): Observable<Medicament> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Medicament>(this.apiUrl, medicament, { headers });
  }

  // 🔍 Récupérer un médicament par ID
  getById(id: number): Observable<Medicament> {
    return this.http.get<Medicament>(`${this.apiUrl}/${id}`);
  }

  // ✏️ Modifier un médicament
  update(id: number, medicament: Medicament): Observable<Medicament> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Medicament>(`${this.apiUrl}/${id}`, medicament, { headers });
  }
// ✅ Supprimer un médicament avec retour texte
delete(id: number): Observable<string> {
  return this.http.delete<string>(`${this.apiUrl}/${id}`, {
    responseType: 'text' as unknown as 'json'  // 💡 Cast propre pour Angular
  });
}



  // 🖼️ Upload avec image (si tu veux activer ça plus tard)
  uploadWithImage(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }
  getByCategorie(categorie: string): Observable<Medicament[]> {
    return this.http.get<Medicament[]>(`${this.apiUrl}/byCategorie/${categorie}`);
  }
  ajouterNote(id: number, note: number): Observable<Medicament> {
    const url = `${this.apiUrl}/ajouter-note/${id}?note=${note}`;
    return this.http.put<Medicament>(url, {});
  }

  // Récupérer la moyenne des notes d'un médicament
  getMoyenneNotes(id: number): Observable<number> {
    const url = `${this.apiUrl}/${id}/moyenne`;
    return this.http.get<number>(url);
  }
  
}

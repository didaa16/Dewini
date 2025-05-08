
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  private readonly cloudName = 'dqvowshji'; // Remplace par ton cloud_name
  private readonly uploadPreset = 'unsigned_uploads'; // Assure-toi que ce preset accepte les fichiers "raw"

  constructor(private http: HttpClient) {}

 uploadPdf(file: File): Observable<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'pdf_uploads');
  formData.append('resource_type', 'auto'); // ✅ important

  return this.http.post<any>(
    `https://api.cloudinary.com/v1_1/dqvowshji/auto/upload`, // ✅ auto ici
    formData
  ).pipe(map(res => res.secure_url));
}





}

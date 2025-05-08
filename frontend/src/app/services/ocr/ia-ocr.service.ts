import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IaOcrService {

  private apiUrl = 'http://localhost:5000/api/predict'; // 🧠 Ton endpoint Flask

  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);

    return this.http.post(this.apiUrl, formData);
  }
}

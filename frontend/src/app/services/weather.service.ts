import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
  private apiKey = '#################'; // Remplacez par votre clé API

  constructor(private http: HttpClient) { }

  getWeatherByLocation(lat: number, lon: number): Observable<any> {
    const url = `${this.apiUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=fr`;
    return this.http.get(url);
  }
}

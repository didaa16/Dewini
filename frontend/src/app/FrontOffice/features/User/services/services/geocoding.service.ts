import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  constructor(private http: HttpClient) { }

  getAddressFromCoordinates(lat: number, lon: number) {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

    return this.http.get<any>(url).pipe(
      map(response => response.display_name)
    );
  }
  getCoordinatesFromAddress(address: string) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

    return this.http.get<any[]>(url).pipe(
      map(results => {
        if (results.length > 0) {
          return {
            lat: parseFloat(results[0].lat),
            lon: parseFloat(results[0].lon)
          };
        } else {
          throw new Error('Adresse non trouvée');
        }
      })
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PharmacyService {
  private overpassUrl = 'https://overpass-api.de/api/interpreter';

  constructor(private http: HttpClient) {}

  getNearbyPharmacies(lat: number, lon: number, radius: number = 1000): Observable<any> {
    const query = `
      [out:json];
      node
        ["amenity"="pharmacy"]
        (around:${radius},${lat},${lon});
      out;
    `;
    const params = {
      data: query
    };
    return this.http.get(this.overpassUrl, { params });
  }
}

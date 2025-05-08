import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-pharmacies-map',
  templateUrl: './pharmacies-map.component.html',
  styleUrls: ['./pharmacies-map.component.css']
})
export class PharmaciesMapComponent implements OnInit {
  map!: L.Map;
  pharmacies: any[] = [];

  pharmacyIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3209/3209265.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.map = L.map('map').setView([36.8065, 10.1815], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap – FR',
    }).addTo(this.map);
  }

  centrerSurMaPosition(): void {
    if (!navigator.geolocation) {
      alert("Votre navigateur ne supporte pas la géolocalisation.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const userIcon = L.icon({
          iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
          iconSize: [32, 32],
          iconAnchor: [16, 32]
        });

        L.marker([lat, lon], { icon: userIcon })
          .addTo(this.map)
          .bindPopup("📍 Vous êtes ici")
          .openPopup();

        this.map.setView([lat, lon], 14);
        this.chargerPharmaciesProches(lat, lon);
      },
      error => {
        alert("Impossible de localiser votre position.");
        console.error(error);
      }
    );
  }

  chargerPharmaciesProches(lat: number, lon: number): void {
    const url = `https://overpass-api.de/api/interpreter?data=[out:json];node(around:8000,${lat},${lon})[amenity=pharmacy];out;`;

    this.http.get<any>(url).subscribe({
      next: (data) => {
        const sorted = data.elements
          .map((ph: any) => ({
            ...ph,
            distance: this.calculerDistance(lat, lon, ph.lat, ph.lon)
          }))
          .filter((ph: any) => ph.distance <= 8)
          .sort((a: any, b: any) => a.distance - b.distance);

        this.pharmacies = sorted;

        this.pharmacies.forEach((pharmacy: any) => {
          const name = pharmacy.tags?.name || "Pharmacie";
          L.marker([pharmacy.lat, pharmacy.lon], { icon: this.pharmacyIcon })
            .addTo(this.map)
            .bindPopup(`🏥 ${name} <br> 🧭 ${pharmacy.distance.toFixed(2)} km`);
        });
      },
      error: (err) => {
        console.error("❌ Erreur lors du chargement des pharmacies", err);
      }
    });
  }

  zoomOnPharmacy(ph: any): void {
    if (this.map) {
      this.map.setView([ph.lat, ph.lon], 17);
      L.popup()
        .setLatLng([ph.lat, ph.lon])
        .setContent(`🏥 ${ph.tags?.name || 'Pharmacie'}<br>🧭 ${ph.distance.toFixed(2)} km`)
        .openOn(this.map);
    }
  }

  // Haversine formula pour calculer distance (en km)
  calculerDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.degToRad(lat2 - lat1);
    const dLon = this.degToRad(lon2 - lon1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(this.degToRad(lat1)) * Math.cos(this.degToRad(lat2)) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  degToRad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}

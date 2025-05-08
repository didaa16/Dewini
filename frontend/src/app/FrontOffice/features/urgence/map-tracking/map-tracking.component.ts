import { Component, AfterViewInit, Input } from '@angular/core';
import * as L from 'leaflet';
import { WebSocketSubject } from 'rxjs/webSocket';
import { GeocodingService } from "../../User/services/services/geocoding.service";

@Component({
  selector: 'app-map-tracking',
  templateUrl: './map-tracking.component.html',
  styleUrls: ['./map-tracking.component.css']
})
export class MapTrackingComponent implements AfterViewInit {
  private map!: L.Map;
  private doctorMarker!: L.Marker;
  private patientMarker!: L.Marker;
  private ws!: WebSocketSubject<any>;
  private path: L.LatLngExpression[] = [];

  @Input() doctorAddress!: string;
  @Input() patientAddress!: string;

  private doctorIcon = L.divIcon({
    html: '📍',
    className: 'custom-doctor-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });

  private patientIcon = L.divIcon({
    html: '🏥',
    className: 'custom-patient-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });

  constructor(private geocodingService: GeocodingService) {}

  ngAfterViewInit(): void {
    if (!this.doctorAddress || !this.patientAddress) {
      console.error('Adresse du médecin ou du patient non disponible');
      return;
    }

    this.geocodingService.getCoordinatesFromAddress(this.doctorAddress).subscribe({
      next: ({ lat, lon }) => {
        const doctorPosition: L.LatLngExpression = [lat, lon];
        this.geocodingService.getCoordinatesFromAddress(this.patientAddress).subscribe({
          next: ({ lat: patientLat, lon: patientLon }) => {
            const patientPosition: L.LatLngExpression = [patientLat, patientLon];
            this.initMap(doctorPosition, patientPosition);
            this.initWebSocket();
          },
          error: (err) => {
            console.error('Erreur lors de la récupération des coordonnées du patient :', err);
          }
        });
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des coordonnées du médecin :', err);
      }
    });
  }

  private initMap(doctorPosition: L.LatLngExpression, patientPosition: L.LatLngExpression): void {
    this.map = L.map('map').setView(doctorPosition, 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

    this.doctorMarker = L.marker(doctorPosition, { icon: this.doctorIcon }).addTo(this.map)
      .bindPopup('🚑 Médecin en route')
      .openPopup();

    this.patientMarker = L.marker(patientPosition, { icon: this.patientIcon }).addTo(this.map)
      .bindPopup('🏥 Patient');

    this.path.push(doctorPosition);
  }

  private initWebSocket(): void {
    this.ws = new WebSocketSubject('ws://localhost:8081/api/v1/ws/location');

    this.ws.subscribe({
      next: (message: any) => {
        console.log('Position reçue :', message);
        this.updateDoctorMarker(message.lat, message.lng);
      },
      error: (err) => console.error('Erreur WebSocket', err),
      complete: () => console.warn('Connexion WebSocket fermée')
    });
  }

  private updateDoctorMarker(lat: number, lng: number): void {
    const newLatLng: L.LatLngExpression = [lat, lng];

    this.doctorMarker.setLatLng(newLatLng);
    this.map.flyTo(newLatLng, this.map.getZoom(), {
      animate: true,
      duration: 1.2
    });

    this.path.push(newLatLng);
    L.polyline(this.path, { color: 'blue' }).addTo(this.map);
  }
}

import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.heat';
import { WebSocketSubject } from 'rxjs/webSocket';
import { UrgenceService } from '../../../../FrontOffice/features/User/services/services/urgence.service';
import { GeocodingService } from "../../../../FrontOffice/features/User/services/services/geocoding.service";
import { Urgence } from '../../../../models/urgence';

@Component({
  selector: 'app-urgence-map-stats',
  templateUrl: './urgence-map-stats.component.html',
  styleUrls: ['./urgence-map-stats.component.css']
})
export class UrgenceMapStatsComponent implements AfterViewInit {
  private map!: L.Map;
  private doctorMarkers: Map<number, L.Marker> = new Map();
  private patientMarkers: Map<number, L.Marker> = new Map();
  private paths: Map<number, L.LatLngExpression[]> = new Map();
  private ws!: WebSocketSubject<any>;
  private heatLayer: L.HeatLayer | null = null;

  private doctorIcon = L.divIcon({
    html: '<i class="fas fa-ambulance text-blue-600 text-2xl"></i>',
    className: 'custom-doctor-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  private patientIcon = L.divIcon({
    html: '<i class="fas fa-user-injured text-red-600 text-2xl"></i>',
    className: 'custom-patient-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  constructor(
    private urgenceService: UrgenceService,
    private geocodingService: GeocodingService
  ) {}

  ngAfterViewInit(): void {
    this.initMap();
    this.loadUrgences();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [36.8, 10.2],
      zoom: 12,
      zoomControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19
    }).addTo(this.map);

    L.control.zoom({ position: 'bottomright' }).addTo(this.map);
  }

  private loadUrgences(): void {
    this.urgenceService.getUrgences().subscribe({
      next: (urgences: Urgence[]) => {
        urgences.forEach((urgence) => this.displayUrgence(urgence));
        this.initWebSocket();
      },
      error: (err) => console.error('Error loading urgences', err)
    });
  }

  private displayUrgence(urgence: Urgence): void {
    const id = urgence.idUrgence;
    const doctorAddress = urgence.medecin?.address;
    const patientAddress = urgence.addressePatient;

    if (!doctorAddress || !patientAddress) {
      console.warn(`Missing address for urgence ${id}`);
      return;
    }

    this.geocodingService.getCoordinatesFromAddress(doctorAddress).subscribe({
      next: ({ lat: docLat, lon: docLon }) => {
        const doctorPos: L.LatLngExpression = [docLat, docLon];
        this.geocodingService.getCoordinatesFromAddress(patientAddress).subscribe({
          next: ({ lat: patLat, lon: patLon }) => {
            const patientPos: L.LatLngExpression = [patLat, patLon];

            const doctorMarker = L.marker(doctorPos, { icon: this.doctorIcon })
              .addTo(this.map)
              .bindPopup(`<b>Doctor</b><br>Urgence #${id}`);

            const patientMarker = L.marker(patientPos, { icon: this.patientIcon })
              .addTo(this.map)
              .bindPopup(`<b>Patient</b><br>Urgence #${id}`);

            this.doctorMarkers.set(id, doctorMarker);
            this.patientMarkers.set(id, patientMarker);
            this.paths.set(id, [doctorPos]);

            L.polyline([doctorPos, patientPos], {
              color: '#60A5FA',
              weight: 3,
              opacity: 0.5,
              dashArray: '5,10'
            }).addTo(this.map);

            this.addPatientToHeatmap(patientPos);
          },
          error: (err) => console.error('Patient geocoding error', err)
        });
      },
      error: (err) => console.error('Doctor geocoding error', err)
    });
  }

  private addPatientToHeatmap(patientPos: L.LatLngExpression): void {
    if (!this.heatLayer) {
      this.heatLayer = L.heatLayer([], {
        radius: 30,
        blur: 20,
        maxZoom: 17,
        gradient: {
          0.2: '#3B82F6', // Blue for low density
          0.4: '#10B981', // Green for medium
          0.6: '#F59E0B', // Yellow for high
          0.8: '#EF4444', // Red for very high
          1.0: '#7C3AED'  // Purple for extreme
        }
      }).addTo(this.map);
    }

    const latLng = L.latLng(patientPos);
    this.heatLayer.addLatLng([latLng.lat, latLng.lng, 0.8]); // Intensity value for emphasis
  }

  private initWebSocket(): void {
    this.ws = new WebSocketSubject('ws://localhost:8089/ws/location');

    this.ws.subscribe({
      next: (message: any) => {
        const urgenceId = message.urgenceId;
        const lat = message.lat;
        const lng = message.lng;

        if (!this.doctorMarkers.has(urgenceId)) return;

        const marker = this.doctorMarkers.get(urgenceId)!;
        const newPos: L.LatLngExpression = [lat, lng];

        marker.setLatLng(newPos);
        this.map.flyTo(newPos, this.map.getZoom(), { animate: true, duration: 1 });

        const path = this.paths.get(urgenceId) || [];
        path.push(newPos);
        this.paths.set(urgenceId, path);

        L.polyline(path, {
          color: '#3B82F6',
          weight: 4,
          opacity: 0.7
        }).addTo(this.map);
      },
      error: (err) => console.error('WebSocket error', err),
      complete: () => console.warn('WebSocket connection closed')
    });
  }
}


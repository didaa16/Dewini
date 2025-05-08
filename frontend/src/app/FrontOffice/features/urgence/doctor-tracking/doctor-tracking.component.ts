import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {NotificationService } from "../../../../notification.service";

@Component({
  selector: 'app-doctor-tracking',
  templateUrl: './doctor-tracking.component.html',
  styleUrls: ['./doctor-tracking.component.css']
})
export class DoctorTrackingComponent implements OnInit, OnDestroy {
  private trackingInterval!: any;
  lat!: number;
  lng!: number;
  isTracking: boolean = false;

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.startTracking();
  }

  startTracking(): void {
    if (navigator.geolocation) {
      this.isTracking = true;

      this.trackingInterval = setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;

            // 🔁 Envoi vers le backend
            this.http.post('http://localhost:8081/api/v1/location/update', {
              lat: this.lat,
              lng: this.lng
            }).subscribe({
              next: () => console.log('✅ Position envoyée'),
              error: (err) => console.error('❌ Erreur envoi position', err),
            });
          },
          (error) => {
            console.error('❌ Erreur géolocalisation', error);
          }
        );
      }, 5000); // toutes les 5 secondes
    } else {
      // alert('❌ Géolocalisation non supportée sur cet appareil.');
      this.notificationService.showWarning('❌ Géolocalisation non supportée sur cet appareil.');
    }
  }

  stopTracking(): void {
    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
      this.isTracking = false;
      console.log('📍 Tracking arrêté');
    }
  }

  ngOnDestroy(): void {
    this.stopTracking();
  }
}

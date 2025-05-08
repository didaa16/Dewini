import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { EvenementService } from '../../../../services/evenement-service.service';
import { Evenement } from '../../../../models/evenement';
import { Lieu } from '../../../../models/Lieu';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list-component.component.html',
  styleUrls: ['./event-list-component.component.css']
})
export class EventListComponent implements OnInit, AfterViewInit, OnDestroy {
  events: Evenement[] = [];
  filteredEvents: Evenement[] = [];
  lieux: Lieu[] = [];
  selectedLieu: Lieu | null = null;
  selectedPrice: number | null = null;
  isLoading = true;
  currentLocation: { lat: number; lng: number } | null = null;
  searchRadius: number = 5;
  notificationMessage: string | null = null;
  private radiusChangeSubject = new Subject<number>();

  private map: L.Map | null = null;
  private markerCluster!: L.MarkerClusterGroup;
  private locationMarker?: L.Marker;

  private defaultIcon = L.icon({
    iconUrl: 'assets/images/marker-icon.png',
    shadowUrl: 'assets/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  constructor(
    private eventService: EvenementService,
    private cdr: ChangeDetectorRef
  ) {
    L.Marker.prototype.options.icon = this.defaultIcon;
    this.radiusChangeSubject.pipe(debounceTime(500)).subscribe(() => {
      this.searchNearby();
    });
  }

  ngOnInit(): void {
    this.loadEvents();
    this.getUserLocation();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
      zoomControl: true,
      keyboard: true
    }).setView([36.8065, 10.1815], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);

    this.markerCluster = L.markerClusterGroup();
    this.map.addLayer(this.markerCluster);
  }

  private loadEvents(): void {
    this.isLoading = true;
    this.eventService.getEventsWithCoordinates().subscribe({
      next: (events) => {
        console.log('Raw events loaded:', JSON.stringify(events, null, 2));
        this.events = events;
        this.filteredEvents = [...events];
        this.extractUniqueLieux();
        this.addMarkersToMap();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des événements', err);
        this.notificationMessage = 'Erreur lors du chargement des événements.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private extractUniqueLieux(): void {
    const lieuxMap = new Map<number, Lieu>();
    this.events.forEach((event) => {
      if (event.lieu && event.lieu.id) {
        lieuxMap.set(event.lieu.id, event.lieu);
      }
    });
    this.lieux = Array.from(lieuxMap.values());
  }

  private getUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log('User location obtained:', this.currentLocation);
          this.addLocationMarker();
          this.cdr.detectChanges();
        },
        (error) => {
          console.warn('Erreur géolocalisation:', error.message);
          this.notificationMessage = 'Impossible de récupérer votre position. Veuillez autoriser la géolocalisation.';
          this.currentLocation = {
            lat: 36.8065,
            lng: 10.1815
          };
          console.log('Using fallback location:', this.currentLocation);
          this.addLocationMarker();
          this.cdr.detectChanges();
        }
      );
    } else {
      console.error('Géolocalisation non supportée par le navigateur.');
      this.notificationMessage = 'La géolocalisation n\'est pas supportée par votre navigateur.';
      this.currentLocation = {
        lat: 36.8065,
        lng: 10.1815
      };
      console.log('Using fallback location:', this.currentLocation);
      this.addLocationMarker();
      this.cdr.detectChanges();
    }
  }

  private addLocationMarker(): void {
    if (!this.currentLocation || !this.map) return;

    if (this.locationMarker) {
      this.map.removeLayer(this.locationMarker);
    }

    this.locationMarker = L.marker(
      [this.currentLocation.lat, this.currentLocation.lng],
      {
        icon: L.icon({
          iconUrl: 'assets/images/user-marker.png',
          iconSize: [32, 32],
          iconAnchor: [16, 32]
        }),
        zIndexOffset: 1000
      }
    ).bindPopup('Votre position').addTo(this.map);
  }

  private addMarkersToMap(): void {
    if (!this.map || !this.markerCluster) return;

    console.log('Filtered events:', this.filteredEvents);
    this.markerCluster.clearLayers();

    this.filteredEvents.forEach((event, index) => {
      console.log(`Processing event ${index + 1}: ${event.nom}`, event.coordonnees);
      if (event.coordonnees && this.isValidCoordinates(event.coordonnees)) {
        console.log(`Adding marker for ${event.nom}: [${event.coordonnees.latitude}, ${event.coordonnees.longitude}]`);
        const marker = L.marker(
          [event.coordonnees.latitude, event.coordonnees.longitude],
          { title: event.nom }
        );

        const popupContent = `
          <div>
            <h5>${event.nom}</h5>
            <p>${event.description?.substring(0, 100) || 'Pas de description'}</p>
            <span class="badge bg-primary">${event.prix || 0} €</span>
            <br/>
            <a href="/events/${event.id}" class="btn btn-sm btn-primary mt-2">Voir</a>
          </div>
        `;

        marker.bindPopup(popupContent);
        this.markerCluster.addLayer(marker);
      } else {
        console.warn(`Invalid or missing coordinates for event "${event.nom}" (index: ${index})`, event.coordonnees);
      }
    });

    const markerCount = this.markerCluster.getLayers().length;
    console.log(`Total markers added: ${markerCount}`);
    if (markerCount > 0) {
      this.map.fitBounds(this.markerCluster.getBounds(), {
        padding: [50, 50],
        maxZoom: 15
      });
    } else {
      console.log('Aucun marqueur ajouté, fitBounds non exécuté.');
      this.notificationMessage = 'Aucun événement trouvé avec des coordonnées valides.';
    }
    this.cdr.detectChanges();
  }

  private isValidCoordinates(coords: any): boolean {
    if (!coords) {
      console.warn('Coordinates are null or undefined');
      return false;
    }
    if (typeof coords.latitude !== 'number' || typeof coords.longitude !== 'number') {
      console.warn('Invalid coordinate types:', coords);
      return false;
    }
    if (isNaN(coords.latitude) || isNaN(coords.longitude)) {
      console.warn('Coordinates are NaN:', coords);
      return false;
    }
    if (coords.latitude === 0 || coords.longitude === 0) {
      console.warn('Coordinates are zero:', coords);
      return false;
    }
    if (coords.latitude < -90 || coords.latitude > 90 || coords.longitude < -180 || coords.longitude > 180) {
      console.warn('Coordinates out of range:', coords);
      return false;
    }
    return true;
  }

  filterEvents(): void {
    this.filteredEvents = this.events.filter((event) => {
      const matchLieu =
        !this.selectedLieu || (event.lieu && event.lieu.id === this.selectedLieu.id);
      const matchPrice =
        this.selectedPrice === null ||
        (this.selectedPrice === 0 ? event.prix === 0 : event.prix > 0);
      return matchLieu && matchPrice;
    });
    console.log('Filtered events after filterEvents:', this.filteredEvents);
    this.addMarkersToMap();
    this.cdr.detectChanges();
  }

  searchNearby(): void {
    if (!this.currentLocation) {
      this.notificationMessage = 'Localisation non disponible. Veuillez autoriser la géolocalisation.';
      return;
    }
    if (
      this.currentLocation.lng < -180 ||
      this.currentLocation.lng > 180 ||
      this.currentLocation.lat < -90 ||
      this.currentLocation.lat > 90
    ) {
      console.error('Invalid user coordinates:', this.currentLocation);
      this.notificationMessage = 'Coordonnées invalides.';
      return;
    }

    console.log('Searching nearby events at:', this.currentLocation, 'with radius:', this.searchRadius, 'km');
    this.isLoading = true;
    this.eventService
      .getNearbyEvents(
        this.currentLocation.lat,
        this.currentLocation.lng,
        this.searchRadius
      )
      .subscribe({
        next: (events) => {
          console.log('Raw events received from nearby search:', JSON.stringify(events, null, 2));
          this.filteredEvents = events;
          this.addMarkersToMap();
          this.isLoading = false;
          if (events.length === 0) {
            console.warn(`No events found within ${this.searchRadius} km. Check database, user location, or backend query.`);
            this.notificationMessage = `Aucun événement trouvé dans un rayon de ${this.searchRadius} km.`;
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Erreur de recherche:', err);
          this.notificationMessage = 'Erreur lors de la recherche des événements: ' + err.message;
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  resetFilters(): void {
    this.selectedLieu = null;
    this.selectedPrice = null;
    this.searchRadius = 5;
    this.filteredEvents = [...this.events];
    console.log('Filtered events after resetFilters:', this.filteredEvents);
    this.addMarkersToMap();
    this.cdr.detectChanges();
  }

  showOnMap(coords: any): void {
    if (!this.isValidCoordinates(coords) || !this.map) return;
    this.map.setView([coords.latitude, coords.longitude], 15);
  }

  onRadiusChange(): void {
    this.radiusChangeSubject.next(this.searchRadius);
  }

  clearNotification(): void {
    this.notificationMessage = null;
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
}
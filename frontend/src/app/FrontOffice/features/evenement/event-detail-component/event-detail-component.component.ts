import { Component, OnInit, OnDestroy } from '@angular/core';
import { Participant } from '../../../../models/participant';
import { Evenement } from '../../../../models/evenement';
import { EvenementService } from '../../../../services/evenement-service.service';
import { WeatherService } from '../../../../services/weather.service';
import { ActivatedRoute } from '@angular/router';
import { RoleEngagement, TypeParticipant } from '../../../../models/participant';
import { Router } from '@angular/router';
@Component({
  selector: 'app-event-detail-component',
  templateUrl: './event-detail-component.component.html',
  styleUrls: ['./event-detail-component.component.css']
})
export class EventDetailComponent implements OnInit, OnDestroy {
  event?: Evenement;
  participants: Participant[] = [];
  isLoading = true;
  weather: any = null;
  afficherFormulaire = false;

  participantSummary = {
    total: 0,
    byType: {} as Record<TypeParticipant, number>,
    byRole: {} as Record<RoleEngagement, number>
  };

  TypeParticipant = TypeParticipant;
  RoleEngagement = RoleEngagement;

  get typeParticipantValues(): TypeParticipant[] {
    return Object.values(TypeParticipant) as TypeParticipant[];
  }

  get roleEngagementValues(): RoleEngagement[] {
    return Object.values(RoleEngagement) as RoleEngagement[];
  }

  constructor(
    private route: ActivatedRoute,
      private router: Router,
    private eventService: EvenementService,
    private weatherService: WeatherService
  ) {
    this.initializeParticipantSummary();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEvent(+id);
    }
  }

  ngOnDestroy(): void {
    // Aucune carte à nettoyer maintenant, donc rien à ajouter ici.
  }

  private initializeParticipantSummary(): void {
    this.typeParticipantValues.forEach(type => {
      this.participantSummary.byType[type] = 0;
    });
    this.roleEngagementValues.forEach(role => {
      this.participantSummary.byRole[role] = 0;
    });
  }
  showWeather(id: number) {
    this.router.navigate(['/weather', id]);
  }
  loadEvent(id: number): void {
    this.isLoading = true;
    this.eventService.retrieveEvenementById(id).subscribe({
      next: (event) => {
        this.event = event;
        this.loadParticipants(id);
        if (event.coordonnees) {
          this.loadWeather(event.coordonnees.latitude, event.coordonnees.longitude);
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement', err);
        this.isLoading = false;
      }
    });
  }

  loadParticipants(eventId: number): void {
    this.eventService.getEventParticipants(eventId).subscribe({
      next: (participants) => {
        this.participants = participants;
        this.updateParticipantSummary(participants);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement participants', err);
        this.isLoading = false;
      }
    });
  }

  ouvrirFormulaire(): void {
    this.afficherFormulaire = true;
  }
  hasValidLocation(): boolean {
    return !!this.event?.coordonnees && typeof this.event.coordonnees.latitude === 'number' && typeof this.event.coordonnees.longitude === 'number';
  }
  updateParticipantSummary(participants: Participant[]): void {
    this.initializeParticipantSummary();
    this.participantSummary.total = participants.length;
    participants.forEach(p => {
      if (p.type !== undefined) this.participantSummary.byType[p.type]++;
      if (p.role !== undefined) this.participantSummary.byRole[p.role]++;
    });
  }

  loadWeather(latitude: number, longitude: number): void {
    this.weatherService.getWeatherByLocation(latitude, longitude).subscribe({
      next: (data) => {
        this.weather = data;
      },
      error: (err) => {
        console.error('Erreur météo', err);
        this.weather = null;
      }
    });
  }

  afficherFormulaireInscription(): void {
    this.afficherFormulaire = true;
  }

  onInscriptionTerminee(message: string): void {
    this.afficherFormulaire = false;
    alert(message);
    if (this.event?.id) {
      this.loadEvent(this.event.id);
    }
  }

  ajusterLieu(): void {
    if (!this.event?.id) return;
    this.eventService.ajusterLieuEvenement(this.event.id).subscribe({
      next: (updatedEvent) => {
        this.event = updatedEvent;
        alert(updatedEvent.salle ? `Lieu changé: ${updatedEvent.salle.nom}` : 'Lieu maintenu');
      },
      error: (err) => {
        console.error('Erreur ajustement lieu', err);
        alert('Erreur modification lieu');
      }
    });
  }

  getBadgeClass(value: TypeParticipant | RoleEngagement, category: 'type' | 'role'): string {
    const colors: {
      type: Record<TypeParticipant, string>,
      role: Record<RoleEngagement, string>
    } = {
      type: {
        [TypeParticipant.ENREGISTRE]: 'bg-info',
        [TypeParticipant.PAYER]: 'bg-success',
        [TypeParticipant.INVITE]: 'bg-dark'
      },
      role: {
        [RoleEngagement.ORGANISATEUR]: 'bg-warning',
        [RoleEngagement.SPONSOR]: 'bg-danger',
        [RoleEngagement.PARTICIPANT]: 'bg-secondary',
        [RoleEngagement.INTERVENANT]: 'bg-primary',
        [RoleEngagement.BENEVOLE]: 'bg-success'
      }
    };

    return colors[category][value as keyof typeof colors[typeof category]] || 'bg-light';
  }

  getEventLocation(): string {
    if (!this.event) return 'Chargement...';
    if (this.event.lieu?.nom) return this.event.lieu.nom;
    if (this.event.salle?.nom) return this.event.salle.nom;
    if (this.event.coordonnees) return `(${this.event.coordonnees.latitude}, ${this.event.coordonnees.longitude})`;
    return 'Lieu non spécifié';
  }

  getParticipationPercentage(): number {
    if (!this.event || !this.event.seuilMinimum) return 0;
    return Math.min(100, (this.participants.length / this.event.seuilMinimum) * 100);
  }
}

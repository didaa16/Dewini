import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Evenement } from '../../../../models/evenement';
import { EvenementService } from '../../../../services/evenement-service.service';
import { PlanningService } from '../../../../services/planning-service.service';
import { Router } from '@angular/router';
import { Lieu } from '../../../../models/Lieu';
import { LieuService } from '../../../../services/lieu.service';
import { DateSuggestionResponse } from '../../../../models/DateSuggestionResponse ';
import { Participation } from '../../../../models/Participation';
import { EventDateSuggestionRequest } from '../../../../models/EventDateSuggestionRequest';
import Chart from 'chart.js/auto';
import { interval, Subscription } from 'rxjs';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { WeatherInfo } from '../../../../models/WeatherInfo';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { ParticipantService } from '../../../../services/participant.service';
import { Participant } from '../../../../models/participant';

@Component({
  selector: 'app-evenement-admin',
  templateUrl: './evenement-admin.component.html',
  styleUrls: ['./evenement-admin.component.css'],
  animations: [
    trigger('flipAnimation', [
      state('active', style({ transform: 'rotateX(0deg)' })),
      state('inactive', style({ transform: 'rotateX(180deg)' })),
      transition('active <=> inactive', animate('300ms ease-in-out'))
    ])
  ]
})
export class EvenementAdminComponent implements OnInit, OnDestroy, AfterViewInit {
  weatherData: { [key: number]: WeatherInfo } = {};
  maxCapacity = 400;
  historicalEventsCount = 1245;
  @ViewChild('participationChart') chartRef!: ElementRef;
  chart!: Chart;
  evenements: Evenement[] = [];
  selectedEvenement: Evenement | null = null;
  isAddMode: boolean = false;
  suggestedDate: string | null = null; // String for AI suggestion
  lieux: Lieu[] = [];
  filteredLieux: Lieu[] = [];
  suggestedDat: DateSuggestionResponse | null = null;
  searchTerm: string = '';
  errorMessage: string | null = null;
  tauxParticipationEstime: number | null = null;
  nombreParticipants: number | null = null;
  selectedEventId: number | null = null;
  participations: Participation[] = [];
  displayedColumns: string[] = ['id', 'participantId', 'statut', 'prixPaye', 'actions'];
  participantsPreview: Participant[] = [];

  // Countdown properties
  countdown: { days: number, hours: number, minutes: number, seconds: number } = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  private countdownSubscription!: Subscription;
  daysState = 'active';
  hoursState = 'active';
  minutesState = 'active';
  secondsState = 'active';
  private prevCountdown: any = {};

  constructor(
    private evenementService: EvenementService,
    private planningService: PlanningService,
    private router: Router,
    private lieuService: LieuService,
    private route: ActivatedRoute,
    private participantService: ParticipantService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadEvenements();
    this.loadLieux();
    this.loadParticipantsPreview();
  }

  loadParticipantsPreview(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.participantService.getParticipants({ evenementId: +eventId, size: 3 }).subscribe({
        next: (page) => {
          this.participantsPreview = page.content;
        }
      });
    }
  }

  getParticipations(eventId: number): void {
    if (this.selectedEventId === eventId) {
      this.selectedEventId = null;
      this.participations = [];
      return;
    }
    this.selectedEventId = eventId;
    this.evenementService.getParticipationsByEvent(eventId).subscribe({
      next: (data) => {
        this.participations = data;
      },
      error: (err) => {
        console.error('Erreur chargement participations:', err);
        this.snackBar.open('Erreur lors du chargement des participations.', 'OK', { duration: 5000 });
      }
    });
  }

  predictParticipation(participationId: number): void {
    this.router.navigate(['/prediction', participationId]);
  }

  adjustEvent(id: number) {
    this.evenementService.adjustEvent(id).subscribe({
      next: (message) => {
        if (message.startsWith('Échec')) {
          this.snackBar.open(message, 'OK', { duration: 5000 });
        } else {
          this.snackBar.open(message, 'OK', { duration: 5000 });
          this.loadEvenements();
        }
      },
      error: (error) => {
        console.error('Erreur lors de l’ajustement : ', error);
        this.snackBar.open('Erreur lors de l’ajustement de l’événement.', 'OK', { duration: 5000 });
      }
    });
  }

  showWeather(id: number) {
    this.router.navigate(['/weather', id]);
  }

  showparticiap(id: number) {
    this.router.navigate(['/participation', id]);
  }

  getTempBarColor(minTemp: number, maxTemp: number): string {
    const avgTemp = (minTemp + maxTemp) / 2;
    if (avgTemp < 15) return '#87CEEB'; // Bleu pour froid
    if (avgTemp < 25) return '#FFD700'; // Jaune pour modéré
    return '#FF4500'; // Rouge pour chaud
  }

  ngAfterViewInit() {
    this.initChart();
  }

  ngOnDestroy() {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }

  initChart() {
    const ctx = this.chartRef.nativeElement.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: { labels: [], datasets: [] },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, max: 1 }
        }
      }
    });
  }

  updateChart() {
    if (this.chart) {
      this.chart.data = {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
        datasets: [{
          label: 'Participation',
          data: [0.45, 0.52, 0.48, 0.55, 0.58, 0.61],
          borderColor: '#4285F4',
          tension: 0.3,
          fill: false
        }]
      };
      this.chart.update();
    }
  }

  getHourRotation(dateString: string): number {
    const date = new Date(dateString);
    return (date.getHours() % 12) * 30 + (date.getMinutes() / 2);
  }

  getMinuteRotation(dateString: string): number {
    const date = new Date(dateString);
    return date.getMinutes() * 6;
  }

  calculateConfidence(rate: number): number {
    return Math.min(100, Math.round(rate * 100 + 30));
  }

  getComparisonText(rate: number): string {
    const diff = Math.round((rate - 0.5) * 100);
    return diff >= 0 ? `+${diff}% vs moyenne ` : `${diff}% vs moyenne`;
  }

  loadEvenements(): void {
    this.evenementService.retrieveAllEvenements().subscribe({
      next: (data) => (this.evenements = data),
      error: (err) => console.error('Erreur chargement événements:', err)
    });
  }

  loadLieux(): void {
    this.lieuService.getLieux().subscribe({
      next: (data) => {
        this.lieux = data;
        this.filteredLieux = [...data];
      },
      error: (err) => console.error('Erreur chargement lieux:', err)
    });
  }

  filterLieux(): void {
    this.filteredLieux = this.lieux.filter((lieu) =>
      lieu.nom.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  handleSubmit(): void {
    if (!this.selectedEvenement) return;

    if (this.isAddMode) {
      this.addEvenement();
    } else {
      this.updateEvenement();
    }
  }

  addEvenement(): void {
    if (!this.selectedEvenement) return;

    try {
      const payload = this.prepareEvenementData();
      console.log('Payload sent to server:', JSON.stringify(payload, null, 2)); // Debug payload

      this.evenementService.addEvenement(payload).subscribe({
        next: (data) => {
          this.evenements.push(data);
          this.resetForm();
          this.isAddMode = false;
          this.selectedEvenement = null;
          this.loadEvenements();
          this.snackBar.open('Événement ajouté avec succès.', 'OK', { duration: 5000 });
        },
        error: (err) => {
          console.error('Erreur ajout:', err);
          console.error('Server error response:', JSON.stringify(err.error, null, 2)); // Log server error details
          this.errorMessage = err.error?.message || 'Erreur lors de l’ajout de l’événement. Vérifiez les données saisies.';
          this.snackBar.open('errorMessage', 'OK', { duration: 5000 });
        }
      });
    } catch (err: any) {
      this.errorMessage = err.message || 'Erreur lors de la préparation des données.';
      this.snackBar.open('errorMessage', 'OK', { duration: 5000 });
    }
  }

  updateEvenement(): void {
    if (!this.selectedEvenement || !this.selectedEvenement.id) return;

    try {
      const payload = this.prepareEvenementData();
      console.log('Payload sent to server:', JSON.stringify(payload, null, 2)); // Debug payload

      this.evenementService.modifyEvenement(this.selectedEvenement.id, payload).subscribe({
        next: () => {
          this.loadEvenements();
          this.resetForm();
          this.snackBar.open('Événement mis à jour avec succès.', 'OK', { duration: 5000 });
        },
        error: (err) => {
          console.error('Erreur modification:', err);
          console.error('Server error response:', JSON.stringify(err.error, null, 2)); // Log server error details
          this.errorMessage = err.error?.message || 'Erreur lors de la mise à jour de l’événement.';
          this.snackBar.open('errorMessage', 'OK', { duration: 5000 });
        }
      });
    } catch (err: any) {
      this.errorMessage = err.message || 'Erreur lors de la préparation des données.';
      this.snackBar.open('errorMessage', 'OK', { duration: 5000 });
    }
  }

  private prepareEvenementData(): any {
    if (!this.selectedEvenement) {
      throw new Error('selectedEvenement is null');
    }

    // Validate required fields
    if (!this.selectedEvenement.nom || this.selectedEvenement.nom.trim() === '') {
      throw new Error('Le nom de l’événement est requis');
    }
    if (!this.selectedEvenement.dateDebut || !this.selectedEvenement.dateFin) {
      throw new Error('Les dates de début et de fin sont requises');
    }
    if (this.selectedEvenement.prix == null || this.selectedEvenement.prix <= 0) {
      throw new Error('Un prix positif est requis');
    }
    if (this.selectedEvenement.seuilMinimum == null || this.selectedEvenement.seuilMinimum <= 0) {
      throw new Error('Un seuil minimum positif est requis');
    }
    if (!this.selectedEvenement.lieu) {
      throw new Error('Le lieu est requis');
    }

    const startDate = this.convertToDate(this.selectedEvenement.dateDebut);
    const endDate = this.convertToDate(this.selectedEvenement.dateFin);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error('Les dates saisies sont invalides');
    }
    if (startDate >= endDate) {
      throw new Error('La date de début doit être antérieure à la date de fin');
    }

    // Prepare payload with dates as strings in YYYY-MM-DD HH:mm format
    const payload: any = {
      nom: this.selectedEvenement.nom,
      dateDebut: this.formatDateForServer(startDate),
      dateFin: this.formatDateForServer(endDate),
      description: this.selectedEvenement.description || '',
      prix: this.selectedEvenement.prix,
      seuilMinimum: this.selectedEvenement.seuilMinimum,
      lieu: this.selectedEvenement.lieu,
      // If server expects only lieu.id, uncomment this:
      // lieu: { id: this.selectedEvenement.lieu.id },
      coordonnees: this.selectedEvenement.coordonnees || { latitude: 0, longitude: 0 },
      participations: this.isAddMode ? null : this.selectedEvenement.participations || []
    };

    // Include id only for updates, not for adds
    if (!this.isAddMode && this.selectedEvenement.id) {
      payload.id = this.selectedEvenement.id;
    }

    return payload;
  }

  editEvenement(id: number): void {
    const event = this.evenements.find((e) => e.id === id);
    if (event) {
      this.selectedEvenement = {
        ...event,
        dateDebut: new Date(event.dateDebut),
        dateFin: new Date(event.dateFin),
        coordonnees: event.coordonnees ?? { latitude: 0, longitude: 0 }
      };
      this.isAddMode = false;
    }
  }

  deleteEvenement(id: number): void {
    if (confirm('Supprimer cet événement ?')) {
      this.evenementService.removeEvenement(id).subscribe({
        next: () => (this.evenements = this.evenements.filter((e) => e.id !== id)),
        error: (err) => console.error('Erreur suppression:', err)
      });
    }
  }

  initNewEvenement(): void {
    const now = new Date();
    const oneWeekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    this.selectedEvenement = {
      id: 0, // Keep id: 0 to satisfy id!: number
      nom: '',
      dateDebut: now,
      dateFin: oneWeekLater,
      description: '',
      prix: 0,
      seuilMinimum: 0,
      lieu: this.lieux[0] || { id: 0, nom: '', estExterieur: false },
      coordonnees: { latitude: 0, longitude: 0 },
      participations: []
    };
    this.isAddMode = true;
  }

  resetForm(): void {
    this.selectedEvenement = null;
    this.isAddMode = false;
    this.searchTerm = '';
    this.filteredLieux = [...this.lieux];
    this.suggestedDate = null;
    this.suggestedDat = null;
    this.tauxParticipationEstime = null;
    this.nombreParticipants = null;
    this.errorMessage = null;
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
    this.countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  // Convert input to Date object
  private convertToDate(dateInput: any): Date {
    if (!dateInput) {
      console.warn('Date input is null or undefined, using current date');
      return new Date();
    }
    if (dateInput instanceof Date) {
      return dateInput;
    }
    const parsedDate = new Date(dateInput);
    if (isNaN(parsedDate.getTime())) {
      console.warn('Invalid date input, using current date');
      return new Date();
    }
    return parsedDate;
  }

  // Format Date to string for server (YYYY-MM-DD HH:mm)
  public formatDateForServer(date: Date): string {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      console.warn('Invalid date, using current date');
      date = new Date();
    }
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  // Format Date or string to display format
  public formatDateForDisplay(dateInput: any): string {
    const date = this.convertToDate(dateInput);
    return this.formatDateForServer(date);
  }

  cancelEdit(): void {
    this.resetForm();
  }

  toggleAddMode(): void {
    this.isAddMode = !this.isAddMode;
    if (this.isAddMode) {
      this.initNewEvenement();
    } else {
      this.selectedEvenement = null;
    }
  }

  applySuggestedDate(): void {
    if (this.suggestedDate && this.selectedEvenement) {
      // Convert string-based suggested date to Date
      const suggested = new Date(this.suggestedDate.replace(' ', 'T'));
      if (isNaN(suggested.getTime())) {
        console.error('Invalid suggested date');
        this.snackBar.open('Date suggérée invalide.', 'OK', { duration: 5000 });
        return;
      }
      this.selectedEvenement.dateDebut = suggested;
      const oneHourLater = new Date(suggested.getTime() + 60 * 60 * 1000);
      this.selectedEvenement.dateFin = oneHourLater;
    }
  }

  suggererDateAvecIA(): void {
    this.errorMessage = null;
    if (!this.selectedEvenement) {
      this.errorMessage = 'Aucun événement sélectionné';
      console.error('Aucun événement sélectionné');
      this.snackBar.open(this.errorMessage, 'OK', { duration: 5000 });
      return;
    }

    if (!this.selectedEvenement.nom || this.selectedEvenement.nom.trim() === '') {
      this.errorMessage = 'Le nom de l’événement est requis';
      console.error('Le nom de l’événement est requis');
      this.snackBar.open(this.errorMessage, 'OK', { duration: 5000 });
      return;
    }
    if (!this.selectedEvenement.dateDebut || !this.selectedEvenement.dateFin) {
      this.errorMessage = 'Les dates de début et de fin sont requises';
      console.error('Les dates de début et de fin sont requises');
      this.snackBar.open(this.errorMessage, 'OK', { duration: 5000 });
      return;
    }
    if (this.selectedEvenement.prix == null || this.selectedEvenement.prix <= 0) {
      this.errorMessage = 'Un prix positif est requis';
      console.error('Un prix positif est requis');
      this.snackBar.open(this.errorMessage, 'OK', { duration: 5000 });
      return;
    }
    if (this.selectedEvenement.seuilMinimum == null || this.selectedEvenement.seuilMinimum <= 0) {
      this.errorMessage = 'Un seuil minimum positif est requis';
      console.error('Un seuil minimum positif est requis');
      this.snackBar.open(this.errorMessage, 'OK', { duration: 5000 });
      return;
    }

    const startDate = this.convertToDate(this.selectedEvenement.dateDebut);
    const endDate = this.convertToDate(this.selectedEvenement.dateFin);
    if (startDate >= endDate) {
      this.errorMessage = 'La date de début doit être antérieure à la date de fin';
      console.error('La date de début doit être antérieure à la date de fin');
      this.snackBar.open(this.errorMessage, 'OK', { duration: 5000 });
      return;
    }

    const requestPayload: EventDateSuggestionRequest = {
      nom: this.selectedEvenement.nom,
      dateDebut: this.formatDateForServer(startDate),
      dateFin: this.formatDateForServer(endDate),
      prix: this.selectedEvenement.prix,
      seuilMinimum: this.selectedEvenement.seuilMinimum
    };

    console.log('Sending payload to backend:', requestPayload);

    this.planningService.suggestBestDate(requestPayload).subscribe({
      next: (res: DateSuggestionResponse) => {
        console.log('Received response from backend:', res);
        this.suggestedDat = res;
        this.suggestedDate = res.date_recommandee; // Keep as string
        this.tauxParticipationEstime = res.taux_participation_estime;
        this.nombreParticipants = res.nombre_participants;
        this.startCountdown();
        this.updateChart();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Échec de la suggestion de date : erreur inconnue';
        console.error('Erreur suggestion IA:', err);
        this.snackBar.open('errorMessage', 'OK', { duration: 5000 });
      }
    });
  }

  startCountdown() {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }

    if (!this.suggestedDat?.date_recommandee) return;

    const targetDate = new Date(this.suggestedDat.date_recommandee.replace(' ', 'T')).getTime();
    this.countdownSubscription = interval(1000).subscribe(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        this.countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
        this.countdownSubscription.unsubscribe();
        return;
      }

      const newCountdown = {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      };

      // Trigger animations when values change
      this.daysState = newCountdown.days !== this.prevCountdown.days ? (this.daysState === 'active' ? 'inactive' : 'active') : this.daysState;
      this.hoursState = newCountdown.hours !== this.prevCountdown.hours ? (this.hoursState === 'active' ? 'inactive' : 'active') : this.hoursState;
      this.minutesState = newCountdown.minutes !== this.prevCountdown.minutes ? (this.minutesState === 'active' ? 'inactive' : 'active') : this.minutesState;
      this.secondsState = newCountdown.seconds !== this.prevCountdown.seconds ? (this.secondsState === 'active' ? 'inactive' : 'active') : this.secondsState;

      this.prevCountdown = { ...newCountdown };
      this.countdown = newCountdown;
    });
  }

  compareLieux(lieu1: Lieu | null, lieu2: Lieu | null): boolean {
    return lieu1 && lieu2 ? lieu1.id === lieu2.id : lieu1 === lieu2;
  }
}

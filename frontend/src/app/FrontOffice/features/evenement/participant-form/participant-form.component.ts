import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Participant, RoleEngagement, TypeEngagement, TypeParticipant } from '../../../../models/participant';
import { Evenement } from '../../../../models/evenement';
import { EvenementService } from '../../../../services/evenement-service.service';
import { ParticipantService } from '../../../../services/participant.service';
import { ActivatedRoute, Router } from '@angular/router';
import {AuthenticationService} from "../../User/services/services/authentication.service";

@Component({
  selector: 'app-participant-form',
  templateUrl: './participant-form.component.html',
  styleUrls: []
})
export class ParticipantFormComponent implements OnInit {
  participant: Participant | undefined;
  dateEngagementFormatted!: string;
  selectedEvenementId!: number;
  evenements: Evenement[] = [];
  isLoading = false;
  participantId!: number;

  roles = Object.values(RoleEngagement);
  types = Object.values(TypeParticipant);
  engagements = Object.values(TypeEngagement);
  isEditMode = false;

  constructor(
    private evenementService: EvenementService,
    private participantService: ParticipantService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.selectedEvenementId = +params['eventId'] || 0;
      this.participantId = +params['participantId'] || 0;

      if (this.participantId) {
        this.isLoading = true;
        this.participantService.getParticipant(this.participantId).subscribe({
          next: (participant) => {
            this.participant = participant;
            this.isEditMode = !!this.participant.id;

            if (this.participant.dateEngagement) {
              this.dateEngagementFormatted = new Date(this.participant.dateEngagement)
                .toISOString()
                .slice(0, 16);
            } else {
              this.dateEngagementFormatted = new Date().toISOString().slice(0, 16);
            }

            if (this.participant.evenement?.id) {
              this.selectedEvenementId = this.participant.evenement.id;
            }

            this.loadEvenements();
            this.isLoading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Erreur lors du chargement du participant:', err);
            alert('Impossible de charger le participant.');
            this.isLoading = false;
            this.router.navigate([this.selectedEvenementId ? `/dashboard/evenement/${this.selectedEvenementId}/participant` : '/participants']);
          }
        });
      } else {
        this.participant = {
          id: 0,
          role: RoleEngagement.PARTICIPANT,
          type: TypeParticipant.ENREGISTRE,
          typeEngagement: TypeEngagement.FORMEL,
          dateEngagement: new Date(),
          evenement: {} as Evenement,
          qrCode: undefined,
          badgeUrl: undefined,
          userId: this.authService.getCurrentUserId(),
        };
        this.dateEngagementFormatted = new Date().toISOString().slice(0, 16);
        this.isEditMode = false;
        this.loadEvenements();
      }
    });

    console.log('Roles disponibles:', this.roles);
    console.log('Types disponibles:', this.types);
    console.log('Engagements disponibles:', this.engagements);
  }

  loadEvenements(): void {
    this.evenements = []; // Clear the array to avoid stale data
    this.evenementService.retrieveAllEvenements().subscribe({
      next: (evenements: Evenement[]) => {
        this.evenements = evenements;
        console.log('Événements chargés (liste complète):', this.evenements.map(ev => ({ id: ev.id, nom: ev.nom })));
        if (this.evenements.length === 0) {
          alert('Aucun événement disponible. Veuillez en créer un avant de continuer.');
        }
        // Ensure the selectedEvenementId is still valid
        if (this.selectedEvenementId && !this.evenements.some(ev => Number(ev.id) === this.selectedEvenementId)) {
          console.warn('L\'événement sélectionné n\'est plus disponible:', this.selectedEvenementId);
          this.selectedEvenementId = 0; // Reset to the default value
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des événements:', err);
        alert('Impossible de charger les événements. Veuillez réessayer.');
      }
    });
  }

  save(): void {
    if (!this.participant) {
      alert('Erreur : Participant non chargé.');
      return;
    }

    console.log('Début de la méthode save()');
    console.log('selectedEvenementId:', this.selectedEvenementId);
    console.log('dateEngagementFormatted:', this.dateEngagementFormatted);

    if (!this.selectedEvenementId || !this.dateEngagementFormatted || !this.participant.role || !this.participant.type || !this.participant.typeEngagement) {
      alert('Veuillez remplir tous les champs requis.');
      return;
    }

    console.log('Événements disponibles avant recherche:', this.evenements.map(ev => ({ id: ev.id, nom: ev.nom })));

    let selectedEvenement = this.evenements.find(ev => Number(ev.id) === this.selectedEvenementId);
    if (!selectedEvenement) {
      console.log('Événement non trouvé dans la liste locale, tentative de récupération depuis le backend...');
      this.evenementService.retrieveEvenementById(this.selectedEvenementId).subscribe({
        next: (evenement) => {
          selectedEvenement = evenement;
          this.proceedWithSave(selectedEvenement);
        },
        error: (err) => {
          console.error('Erreur lors de la récupération de l\'événement:', err);
          alert('Erreur : Événement non trouvé. Veuillez sélectionner un événement valide.');
          this.isLoading = false;
        }
      });
    } else {
      this.proceedWithSave(selectedEvenement);
    }
  }

  proceedWithSave(selectedEvenement: Evenement): void {
    this.participant!.evenement = selectedEvenement;
    this.participant!.dateEngagement = new Date(this.dateEngagementFormatted);
    console.log('Participant avant sauvegarde:', JSON.stringify(this.participant, null, 2));
    this.isLoading = true;

    if (this.isEditMode) {
      this.participantService.updateParticipant(this.participantId, this.participant!).subscribe({
        next: (response) => {
          console.log('Mise à jour réussie, réponse:', response);
          this.router.navigate([`/dashboard/evenement/${this.selectedEvenementId}/participant`]);
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Erreur lors de la mise à jour:', err);
          alert('Erreur lors de la mise à jour : ' + (err.statusText || err.message || 'Erreur inconnue'));
        },
        complete: () => {
          console.log('Mise à jour terminée');
          this.isLoading = false;
        }
      });
    } else {
      this.participantService.createParticipant(this.participant!).subscribe({
        next: (response) => {
          console.log('Création réussie, réponse:', response);
          this.router.navigate([`/dashboard/evenement/${this.selectedEvenementId}/participant`]);
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Erreur lors de la création:', err);
          alert('Erreur lors de la création : ' + (err.statusText || err.message || 'Erreur inconnue'));
        },
        complete: () => {
          console.log('Création terminée');
          this.isLoading = false;
        }
      });
    }
  }

  cancel(): void {
    if (this.selectedEvenementId && this.selectedEvenementId !== 0) {
      this.router.navigate([`/dashboard/evenement/${this.selectedEvenementId}/participant`]);
    } else {
      this.router.navigate(['/dashboard/participants']);
    }
  }

  onEvenementChange(): void {
    console.log('Événement sélectionné:', this.selectedEvenementId);
  }

  onRoleChange(): void {
    console.log('Rôle sélectionné:', this.participant?.role);
  }

  onTypeChange(): void {
    console.log('Type sélectionné:', this.participant?.type);
  }

  onEngagementChange(): void {
    console.log('Engagement sélectionné:', this.participant?.typeEngagement);
  }

  onDateChange(): void {
    console.log('Date sélectionnée:', this.dateEngagementFormatted);
  }
}

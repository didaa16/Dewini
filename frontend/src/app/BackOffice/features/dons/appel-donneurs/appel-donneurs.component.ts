import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DonService } from "../../../../FrontOffice/features/User/services/services/don-service.service";
import { Don, State } from 'src/app/models/don.model';

@Component({
  selector: 'app-appel-donneurs',
  templateUrl: './appel-donneurs.component.html',
  styleUrls: ['./appel-donneurs.component.css']
})
export class AppelDonneursComponent implements OnInit {
  donId!: number;
  don!: Don;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  presentCount: number = 0;
  absentCount: number = 0;

  // Pour faciliter l'affichage dans le template
  State = State;

  constructor(
    private route: ActivatedRoute,
    private donService: DonService
  ) {}

  ngOnInit(): void {
    this.donId = +this.route.snapshot.params['id'];
    this.loadDonDetails();
  }

  get presentPercentage(): string {
    const total = this.don?.donneurs?.length || 0;
    return total > 0 ? ((this.presentCount / total) * 100).toFixed(1) : '0.0';
  }

  get absentPercentage(): string {
    const total = this.don?.donneurs?.length || 0;
    return total > 0 ? ((this.absentCount / total) * 100).toFixed(1) : '0.0';
  }

  loadDonDetails(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.donService.getDonById(this.donId).subscribe({
      next: (don) => {
        this.don = don;
        this.calculateAttendance();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement du don:', err);
        this.errorMessage = 'Erreur lors du chargement des participants';
        this.isLoading = false;
      }
    });
  }

  updateDonneurState(utilisateurId: number | undefined, newState: State): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.donService.updateDonneurState(this.donId, utilisateurId, newState).subscribe({
      next: (updatedDon) => {
        this.don = updatedDon;
        this.calculateAttendance();
        this.successMessage = 'Statut mis à jour avec succès';
        this.isLoading = false;

        // Supprimer le message après 3 secondes
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: (err) => {
        console.error('Erreur mise à jour:', err);
        this.errorMessage = 'Erreur lors de la mise à jour du statut';
        this.isLoading = false;
      }
    });
  }

  calculateAttendance(): void {
    if (!this.don || !this.don.donneurs) {
      this.presentCount = 0;
      this.absentCount = 0;
      return;
    }
    this.presentCount = this.don.donneurs.filter(donneur => donneur.state === State.PRESENT).length;
    this.absentCount = this.don.donneurs.filter(donneur => donneur.state === State.ABSENT).length;
  }

  getBadgeClass(state: State): string {
    switch(state) {
      case State.PRESENT: return 'badge-present';
      case State.ABSENT: return 'badge-absent';
      default: return 'badge-secondary';
    }
  }

  getStateText(state: State): string {
    switch(state) {
      case State.PRESENT: return 'Présent';
      case State.ABSENT: return 'Absent';
      default: return 'En attente';
    }
  }
}

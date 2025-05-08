import { Component, OnInit } from '@angular/core';
import { Participant, RoleEngagement, TypeEngagement, TypeParticipant } from '../../../../models/participant';
import { ParticipantService } from '../../../../services/participant.service';
import { ParticipantFilter } from '../../../../models/ParticipantFilter';
import { Page } from '../../../../models/Page';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import {AuthenticationService} from "../../User/services/services/authentication.service";

@Component({
  selector: 'app-participant-list',
  templateUrl: './participant-list.component.html',
  styleUrls: []
})
export class ParticipantListComponent implements OnInit {
  participants: Participant[] = [];
  selectedParticipants: number[] = [];
  filter: ParticipantFilter = { page: 0, size: 10 };
  totalElements = 0;
  isLoading = false;

  roles = Object.values(RoleEngagement); // ['ORGANISATEUR', 'SPONSOR', 'PARTICIPANT', 'INTERVENANT', 'BENEVOLE']
  types = Object.values(TypeParticipant); // ['ENREGISTRE', 'PAYER', 'INVITE']
  engagements = Object.values(TypeEngagement); // ['FORMEL', 'INFORMEL', 'SPONSOR']

  constructor(
    private participantService: ParticipantService,
    private router: Router,
    private authService: AuthenticationService,
  ) {}

  ngOnInit(): void {
    this.loadParticipants();
  }

  loadParticipants(): void {
    this.isLoading = true;
    this.participantService.getParticipants(this.filter).subscribe({
      next: (page: Page<Participant>) => {
        this.participants = page.content;
        this.totalElements = page.totalElements;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des participants:', err);
        this.isLoading = false;
      }
    });
  }

  getRoleClass(role: RoleEngagement): string {
    return role.toLowerCase();
  }

  openCreateModal(): void {
    this.router.navigate(['/dashboard/evenement/${participant.evenement.id}/participant/nouveau']);
  }


  openEditModal(participant: Participant): void {
    if (!participant.evenement?.id || !participant.id) {
      console.error('Événement ou participant non valide:', participant);
      alert('Erreur : Événement ou participant non valide.');
      return;
    }

    this.router.navigate([`/dashboard/evenement/${participant.evenement.id}/participant/${participant.id}/editer`]);
  }

  generateBadge(id: number): void {
    this.participantService.generateBadge(id).subscribe({
      next: (response: any) => {
        const participant = this.participants.find(p => p.id === id);
        if (participant) {
          participant.badgeUrl = response.badgeUrl;
        }
      }
    });
  }

  exportSelected(): void {
    if (this.selectedParticipants.length === 0) return;

    this.participantService.exportParticipants(this.selectedParticipants)
      .subscribe((blob: Blob) => {
        saveAs(blob, `participants_export_${new Date().toISOString()}.xlsx`);
      });
  }

  onFilterChange(): void {
    this.filter.page = 0;
    this.loadParticipants();
  }

  toggleSelectAll(checked: boolean): void {
    this.selectedParticipants = checked ? this.participants.map(p => p.id) : [];
  }

  toggleParticipantSelection(id: number, checked: boolean): void {
    if (checked) {
      this.selectedParticipants.push(id);
    } else {
      this.selectedParticipants = this.selectedParticipants.filter(pId => pId !== id);
    }
  }

  previousPage(): void {
    this.filter.page = (this.filter.page || 0) - 1;
    this.loadParticipants();
  }

  nextPage(): void {
    this.filter.page = (this.filter.page || 0) + 1;
    this.loadParticipants();
  }

  deleteParticipant(participantId: number): void {
    if (confirm('Supprimer ce participant ?')) {
      this.participantService.deleteParticipant(participantId).subscribe({
        next: () => this.loadParticipants(),
        error: (err) => console.error('Erreur suppression', err)
      });
    }
  }

  deleteSelected(): void {
    console.log('Suppression des participants sélectionnés');
  }
}

import { Component } from '@angular/core';
import { DonService } from "../../../../FrontOffice/features/User/services/services/don-service.service";
import { Don, State } from 'src/app/models/don.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-affichage-dons-dashboard',
  templateUrl: './affichage-dons-dashboard.component.html',
  styleUrls: ['./affichage-dons-dashboard.component.css']
})
export class AffichageDonsDashboardComponent {
  dons: Don[] = [];
  filteredDons: Don[] = [];
  loading = true;
  error: string | null = null;
  dateFilter: string = 'all';

  // Configuration for donation types
  donTypesConfig = {
    'SANG': { class: 'badge-sang', icon: 'fa-droplet' },
    'PLASMA': { class: 'badge-plasma', icon: 'fa-vial' },
    'PLAQUETTES': { class: 'badge-plaquettes', icon: 'fa-microscope' },
    'default': { class: 'bg-success', icon: 'fa-heart' }
  };

  constructor(
    private donService: DonService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDons();
  }

  loadDons(): void {
    this.loading = true;
    this.error = null;

    this.donService.getAllDons().subscribe({
      next: (data) => {
        this.dons = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load donations. Please try again.';
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  applyFilters(): void {
    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    this.filteredDons = this.dons.filter(don => {
      const donDate = new Date(don.dateDon);

      switch (this.dateFilter) {
        case 'today':
          return donDate.toDateString() === today.toDateString();
        case 'week':
          return donDate >= weekStart;
        case 'month':
          return donDate >= monthStart;
        case 'past':
          return donDate < now;
        case 'future':
          return donDate >= now;
        default:
          return true;
      }
    });

    // Sort by date (newest to oldest)
    this.filteredDons.sort((a, b) =>
      new Date(b.dateDon).getTime() - new Date(a.dateDon).getTime()
    );
  }

  getDonTypeClass(type: string): string {
    return this.donTypesConfig[type as keyof typeof this.donTypesConfig]?.class
           || this.donTypesConfig.default.class;
  }

  getDonTypeIcon(type: string): string {
    return this.donTypesConfig[type as keyof typeof this.donTypesConfig]?.icon
           || this.donTypesConfig.default.icon;
  }

  getParticipationPercentage(don: Don): number {
    const total = this.getDonneursCount(don);
    const present = this.getDonneursPresentCount(don);
    return total > 0 ? Math.round((present / total) * 100) : 0;
  }

  editDon(donId: number): void {
    this.router.navigate(['/dashboard/dons', donId, 'edit']);
  }

  appel(donId: number): void {
    this.router.navigate(['/dashboard/dons', donId, 'appel']);
  }

  confirmDelete(id: number): void {
    if (confirm('Are you sure you want to delete this donation? This action is irreversible.')) {
      this.donService.deleteDon(id).subscribe({
        next: () => {
          this.loadDons();
        },
        error: (err) => {
          this.error = 'Failed to delete donation.';
          console.error('Error:', err);
        }
      });
    }
  }

  getDonneursCount(don: Don): number {
    return don.donneurs?.length || 0;
  }

  getDonneursPresentCount(don: Don): number {
    return don.donneurs?.filter(d => d.state === State.PRESENT).length || 0;
  }
}

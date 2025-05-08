import { Component, OnInit } from '@angular/core';
import { Medicament } from 'src/app/models/models_pharma/medicament.model';
import { MedicamentService } from 'src/app/services/medicament/medicament.service';

@Component({
  selector: 'app-medicament-admin-list',
  templateUrl: './medicament-admin-list.component.html',
  styleUrls: ['./medicament-admin-list.component.css']
})
export class MedicamentAdminListComponent implements OnInit {
  medicaments: Medicament[] = [];

  page: number = 1;
  pageSize: number = 6;
  searchTerm: string = '';
  triSelection: string = '';
  categorieSelectionnee: string = '';
  showStats: boolean = false;

  constructor(private medicamentService: MedicamentService) {}

  ngOnInit(): void {
    this.chargerMedicaments();
  }

  chargerMedicaments(): void {
    this.medicamentService.getAll().subscribe({
      next: data => this.medicaments = data,
      error: err => console.error('❌ Erreur chargement médicaments :', err)
    });
  }

  supprimer(id: number): void {
    if (confirm("Souhaitez-vous vraiment supprimer ce médicament ?")) {
      this.medicamentService.delete(id).subscribe({
        next: (message: string) => {
          alert(message);
          this.medicaments = this.medicaments.filter(m => m.id !== id);
          const start = (this.page - 1) * this.pageSize;
          if (this.medicamentsFiltres.length <= start && this.page > 1) {
            this.page--;
          }
        },
        error: err => {
          console.error('❌ Erreur suppression', err);
          alert(typeof err.error === 'string' ? err.error : 'Erreur lors de la suppression.');
        }
      });
    }
  }

  get medicamentsFiltres(): Medicament[] {
    let filtered = this.medicaments
      .filter(med => med.nom.toLowerCase().includes(this.searchTerm.toLowerCase()))
      .filter(med => this.categorieSelectionnee ? med.categorie === this.categorieSelectionnee : true);

    switch (this.triSelection) {
      case 'prix-asc':
        filtered.sort((a, b) => a.prix - b.prix);
        break;
      case 'prix-desc':
        filtered.sort((a, b) => b.prix - a.prix);
        break;
      case 'stock':
        filtered.sort((a, b) => b.quantiteEnStock - a.quantiteEnStock);
        break;
      case 'expiration':
        filtered.sort((a, b) => new Date(a.dateExpiration).getTime() - new Date(b.dateExpiration).getTime());
        break;
    }

    const start = (this.page - 1) * this.pageSize;
    return filtered.slice(start, start + this.pageSize);
  }

  get totalPages(): number[] {
    const total = Math.ceil(
      this.medicaments
        .filter(med => med.nom.toLowerCase().includes(this.searchTerm.toLowerCase()))
        .filter(med => this.categorieSelectionnee ? med.categorie === this.categorieSelectionnee : true)
        .length / this.pageSize
    );
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  isExpired(date: string): boolean {
    const today = new Date();
    const expiration = new Date(date);
    today.setHours(0, 0, 0, 0);
    expiration.setHours(0, 0, 0, 0);
    return expiration < today;
  }

  isExpiringSoon(date: string): boolean {
    const today = new Date();
    const expiration = new Date(date);
    today.setHours(0, 0, 0, 0);
    expiration.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((expiration.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return diffDays >= 0 && diffDays <= 30;
  }

  get totalMedicaments(): number {
    return this.medicaments.length;
  }

  get totalEnRupture(): number {
    return this.medicaments.filter(m => m.quantiteEnStock === 0).length;
  }

  get totalExpirant(): number {
    return this.medicaments.filter(m => this.isExpiringSoon(m.dateExpiration)).length;
  }

  get totalExpires(): number {
    return this.medicaments.filter(m => this.isExpired(m.dateExpiration)).length;
  }

  get medicamentsExpirantBientot(): Medicament[] {
    return this.medicaments.filter(m => this.isExpiringSoon(m.dateExpiration));
  }

  get categoriesDisponibles(): string[] {
    const toutes = this.medicaments
      .map(m => m.categorie)
      .filter((cat): cat is string => !!cat);
    return Array.from(new Set(toutes));
  }

  get statsParCategorie(): { categorie: string, total: number, rupture: number, expirants: number }[] {
    const stats: { [key: string]: { total: number, rupture: number, expirants: number } } = {};
    for (const med of this.medicaments) {
      if (!med.categorie) continue;
      if (!stats[med.categorie]) {
        stats[med.categorie] = { total: 0, rupture: 0, expirants: 0 };
      }
      stats[med.categorie].total++;
      if (med.quantiteEnStock === 0) stats[med.categorie].rupture++;
      if (this.isExpiringSoon(med.dateExpiration)) stats[med.categorie].expirants++;
    }
    return Object.entries(stats).map(([categorie, s]) => ({
      categorie,
      ...s
    }));
  }

  toggleStats(): void {
    this.showStats = !this.showStats;
  }
  afficherStats: boolean = false;


  averageNote(med: Medicament): number {
    if (!med.notes || med.notes.length === 0) {
      return 0;
    }
    const total = med.notes.reduce((sum, n) => sum + n, 0);
    return total / med.notes.length;
  }

}

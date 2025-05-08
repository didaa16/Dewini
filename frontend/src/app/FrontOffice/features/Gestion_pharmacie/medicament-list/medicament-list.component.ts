import { Component, OnInit } from '@angular/core';
import { Medicament } from 'src/app/models/models_pharma/medicament.model';
import { MedicamentService } from 'src/app/services/medicament/medicament.service';
import { Router } from '@angular/router';
import { PanierService } from 'src/app/services/panier/panier.service';
import { FavorisService } from 'src/app/services/favoris/favoris.service';
declare var bootstrap: any;


@Component({
  selector: 'app-medicament-list',
  templateUrl: './medicament-list.component.html',
  styleUrls: ['./medicament-list.component.css']
})
export class MedicamentListComponent implements OnInit {
  medicaments: Medicament[] = [];
  searchTerm: string = '';
  page: number = 1;
  pageSize: number = 8;
  categorieFiltre: string = '';
  tooltips: any[] = []; // ✅ Liste des tooltips créés

  

  categories: string[] = [
    "💊 Compléments alimentaires",
    "🧴 Visage",
    "💇‍♀️ Cheveux",
    "🛀 Corps",
    "🧼 Hygiène",
    "🌞 Solaires",
    "🌿 Bio & naturel",
    "🩺 Matériel médical",
    "👨‍⚕️ Homme",
    "👩‍🍼 Bébé et maman",
    "👁️ Soins des yeux",
    "🧘 Bien-être & relaxation"
  ];
  
  

  constructor(
    private medicamentService: MedicamentService,
    private router: Router,
    public panierService: PanierService,
    public favorisService : FavorisService
  ) {}

  ngOnInit(): void {
    this.chargerMedicaments();
    setTimeout(() => {
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      this.tooltips = tooltipTriggerList.map((tooltipTriggerEl: any) => {
        return new bootstrap.Tooltip(tooltipTriggerEl);
      });
    }, 0);
  }
  ngOnDestroy(): void {
    this.tooltips.forEach(tooltip => tooltip.dispose());
    this.tooltips = [];
  }
  

  chargerMedicaments() {
    this.medicamentService.getAll().subscribe({
      next: data => {
        this.medicaments = data;
        console.log('✅ Médicaments reçus :', this.medicaments);
      },
      error: err => {
        console.error('❌ Erreur lors du chargement des médicaments', err);
      }
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
        error: (err) => {
          console.error('❌ Erreur suppression', err);
          const msg = typeof err.error === 'string' ? err.error : "Une erreur est survenue lors de la suppression.";
          alert(msg);
        }
      });
    }
  }

  get medicamentsFiltres(): Medicament[] {
    let filtres = this.medicaments
      .filter(m => m.nom.toLowerCase().includes(this.searchTerm.toLowerCase()))
      .filter(m => this.categorieFiltre === '' || m.categorie === this.categorieFiltre);
  
    if (this.triPrix === 'asc') {
      filtres = filtres.sort((a, b) => a.prix - b.prix);
    } else if (this.triPrix === 'desc') {
      filtres = filtres.sort((a, b) => b.prix - a.prix);
    }
  
    return filtres;
  }
  
  

  get medicamentsParPage(): Medicament[] {
    const start = (this.page - 1) * this.pageSize;
    return this.medicamentsFiltres.slice(start, start + this.pageSize);
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

  get totalPages(): number[] {
    const total = Math.ceil(this.medicamentsFiltres.length / this.pageSize);
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  get medicamentsExpirantBientot(): Medicament[] {
    return this.medicaments.filter(med => this.isExpiringSoon(med.dateExpiration));
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

  get medicamentsGroupesParCategorie(): { [key: string]: Medicament[] } {
    const grouped: { [key: string]: Medicament[] } = {};
    for (const med of this.medicamentsFiltres) {
      const cat = med.categorie || 'Autres';
      if (!grouped[cat]) {
        grouped[cat] = [];
      }
      grouped[cat].push(med);
    }
    return grouped;
  }
  affichageGrille: boolean = true;
  triPrix: string = ''; // '' | 'asc' | 'desc'
  toastVisible: boolean = false;
toastMessage: string = '';

afficherToast(message: string): void {
  this.toastMessage = message;
  this.toastVisible = true;
  setTimeout(() => this.toastVisible = false, 3000);
}


ajouterAuPanier(med: Medicament): void {
  this.panierService.ajouterAuPanier(med);
  this.afficherToast(`🛒 ${med.nom} ajouté au panier !`);
}
allerAuDetail(id: number): void {
  this.router.navigate(['/medicaments/detail', id]);
}


  // Ajoute cette propriété dans ta classe
favoris: number[] = [];

ajouterAuxFavoris(med: Medicament): void {
  const index = this.favoris.indexOf(med.id!);
  if (index === -1) {
    this.favoris.push(med.id!);
  } else {
    this.favoris.splice(index, 1); // toggle
  }
}
getMoyenneNote(med: Medicament): number {
  if (!med.notes || med.notes.length === 0) return 0;
  const total = med.notes.reduce((a, b) => a + b, 0);
  return total / med.notes.length;
}
retirerFavori(med: Medicament): void {
  if (this.favorisService.estFavori(med.id!)) {
    this.favorisService.ajouterOuRetirer(med);
    this.afficherToast(`❌ ${med.nom} retiré des favoris.`);
  }
}


} 

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MedicamentService } from 'src/app/services/medicament/medicament.service';
import { Medicament } from 'src/app/models/models_pharma/medicament.model';
import { FdaService } from 'src/app/services/fda/fda.service';
import { PanierService } from 'src/app/services/panier/panier.service';

@Component({
  selector: 'app-medicament-detail',
  templateUrl: './medicament-detail.component.html',
  styleUrls: ['./medicament-detail.component.css']
})
export class MedicamentDetailComponent implements OnInit {
  medicament?: Medicament;
  medicamentsSimilaires: Medicament[] = [];
  fdaData?: any;
  fdaError?: string;

  noteUtilisateur: number = 0; // Note actuelle donnée par l'utilisateur

  constructor(
    private route: ActivatedRoute,
    private medicamentService: MedicamentService,
    private fdaService: FdaService,
    private panierService: PanierService // ✅ Ajout ici !
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.medicamentService.getById(id).subscribe({
        next: (data) => {
          this.medicament = data;
          this.loadFdaData(data.nom);
          this.medicamentService.getAll().subscribe(meds => {
            this.medicamentsSimilaires = meds.filter(m => m.categorie === data.categorie && m.id !== id);
          });
        },
        error: (err) => console.error('❌ Erreur chargement médicament', err)
      });
    }
  }

  loadFdaData(nomMedicament: string): void {
    const cleaned = this.normalizeNameForFda(nomMedicament);
  
    this.fdaService.getDrugInfoByIngredient(cleaned).subscribe({
      next: (res: any) => {
        this.fdaData = res.results[0];
      },
      error: (err: any) => {
        console.warn('❌ Aucune donnée FDA trouvée', err);
        this.fdaError = "Aucune information complémentaire trouvée pour ce médicament.";
      }
    });
  }
  
  normalizeNameForFda(nom: string): string {
    return nom
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')  // supprime accents, points, virgules, etc.
      .split(' ')
      .find(word => word.length > 3) || nom.toLowerCase(); // garde le mot principal
  }

  quantite: number = 1;

  ajouterAuPanier(med: Medicament, quantite: number): void {
    this.panierService.ajouterAuPanier(med, quantite);
    this.afficherToast(`🛒 ${quantite} x ${med.nom} ajouté(s) au panier`);
  }

  incrementerQuantite(): void {
    this.quantite++;
  }

  decrementerQuantite(): void {
    if (this.quantite > 1) {
      this.quantite--;
    }
  }

  getNombreVendus(): number {
    return Math.floor(Math.random() * 10) + 1;
  }

  toastVisible = false;
  toastMessage = '';

  afficherToast(message: string): void {
    this.toastMessage = message;
    this.toastVisible = true;
    setTimeout(() => this.toastVisible = false, 3000);
}

  // Ajouter une note au médicament
  ajouterNote(n: number): void {
    if (!this.medicament) return;

    // Mise à jour de la noteUtilisateur localement
    this.noteUtilisateur = n;

    // Appel API pour ajouter la note
    this.medicamentService.ajouterNote(this.medicament.id!, n).subscribe({
      next: (updatedMed: Medicament) => {
        this.medicament = updatedMed;
        this.afficherToast(`Votre note de ${n} a été ajoutée !`);
      },
      error: (err: any) => {
        console.error('Erreur lors de l\'ajout de la note', err);
        this.afficherToast('Erreur lors de l\'ajout de la note.');
      }
    });
  }

  // Calcul de la moyenne des notes
  get moyenneNote(): number {
    if (!this.medicament?.notes || this.medicament.notes.length === 0) return 0;
    const total = this.medicament.notes.reduce((a, b) => a + b, 0);
    return total / this.medicament.notes.length;
  }
}

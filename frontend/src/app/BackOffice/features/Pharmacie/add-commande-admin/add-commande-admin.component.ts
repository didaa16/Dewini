import { Component, OnInit } from '@angular/core';
import { MedicamentService } from 'src/app/services/medicament/medicament.service';
import { LivraisonService } from 'src/app/services/livraison/livraison.service';
import { Medicament } from 'src/app/models/models_pharma/medicament.model';
import { Livraison } from 'src/app/models/models_pharma/livraison.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-commande-admin',
  templateUrl: './add-commande-admin.component.html',
  styleUrls: ['./add-commande-admin.component.css']
})
export class AddCommandeAdminComponent implements OnInit {

  newCommande: Livraison = {
    nomClient: '',
    adresse: '',
    etat: 'EN_COURS',
    dateLivraison: new Date(),
    medicaments: []
  };

  allMedicaments: Medicament[] = [];
  selectedMedicaments: number[] = [];

  constructor(
    private medicamentService: MedicamentService,
    private livraisonService: LivraisonService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.medicamentService.getAll().subscribe(data => {
      this.allMedicaments = data;
    });
  }


  toastVisible = false;
  addCommande(): void {
    if (this.selectedMedicaments.length === 0) {
      alert('❌ Veuillez sélectionner au moins un médicament.');
      return;
    }
  
    this.newCommande.medicaments = this.allMedicaments.filter(m => this.selectedMedicaments.includes(m.id!));
  
    this.livraisonService.addLivraison(this.newCommande).subscribe({
      next: () => {
        this.toastVisible = true;
  
        // Masquer le toast et rediriger après 3 secondes
        setTimeout(() => {
          this.toastVisible = false;
          this.router.navigate(['/dashboard/commandes']);
        }, 3000);
      },
      error: () => alert("❌ Erreur lors de l'ajout")
    });
  }
  
  
}

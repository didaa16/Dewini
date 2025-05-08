import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LivraisonService } from 'src/app/services/livraison/livraison.service';
import { Livraison } from 'src/app/models/models_pharma/livraison.model';

@Component({
  selector: 'app-edit-commande',
  templateUrl: './edit-commande.component.html',
  styleUrls: ['./edit-commande.component.css']
})
export class EditCommandeComponent implements OnInit {
  selectedLivraison: Livraison = {
    id: 0,
    nomClient: '',
    adresse: '',
    etat: '',
    dateLivraison: new Date(),
    medicaments: []
  };

  constructor(
    private livraisonService: LivraisonService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.livraisonService.getLivraisonById(id).subscribe({
        next: (data: Livraison) => this.selectedLivraison = data,
        error: (err: any) => console.error('❌ Erreur chargement livraison', err)
        
      });
    }
  }

  // ✅ Soumettre la mise à jour
  submitUpdate(): void {
    if (this.selectedLivraison && this.selectedLivraison.id) {
      this.livraisonService.updateLivraison(this.selectedLivraison.id, this.selectedLivraison).subscribe({
        next: () => {
          console.log('✅ Livraison mise à jour');
          this.router.navigate(['/commandes']); // Redirige vers la liste par exemple
        },
        error: err => console.error('❌ Erreur update livraison', err)
      });
    }
  }
}

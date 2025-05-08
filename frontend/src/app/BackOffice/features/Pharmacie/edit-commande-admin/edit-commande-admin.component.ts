import { Component,OnInit } from '@angular/core';
import { LivraisonService } from 'src/app/services/livraison/livraison.service';
import { Livraison } from 'src/app/models/models_pharma/livraison.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-commande-admin',
  templateUrl: './edit-commande-admin.component.html',
  styleUrls: ['./edit-commande-admin.component.css']
})
export class EditCommandeAdminComponent implements OnInit {

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
            this.toastVisible = true;
    
            // Masquer le toast après 3 secondes, puis rediriger
            setTimeout(() => {
              this.toastVisible = false;
              this.router.navigate(['/dashboard/commandes']);
            }, 3000);
          },
          error: err => {
            console.error('❌ Erreur update livraison', err);
            alert('Erreur lors de la mise à jour.');
          }
        });
      }
    }
    

    toastVisible = false;

}

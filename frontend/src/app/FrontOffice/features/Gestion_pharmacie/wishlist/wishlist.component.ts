import { Component } from '@angular/core';
import { FavorisService } from 'src/app/services/favoris/favoris.service';
import { Medicament } from 'src/app/models/models_pharma/medicament.model';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent {
  constructor(public favorisService: FavorisService) {}
  get favoris(): Medicament[] {
    return this.favorisService.getFavoris();
  }
  retirerFavori(med: Medicament): void {
    this.favorisService.ajouterOuRetirer(med);
  }
  
}

import { Injectable } from '@angular/core';
import { Medicament } from 'src/app/models/models_pharma/medicament.model';

@Injectable({
  providedIn: 'root'
})
export class PanierService {
  private panier: Medicament[] = [];

  constructor() {
    const saved = localStorage.getItem('panier');
    if (saved) {
      this.panier = JSON.parse(saved);
    }
  }

  private savePanier(): void {
    localStorage.setItem('panier', JSON.stringify(this.panier));
  }

  ajouterAuPanier(med: Medicament, quantite: number = 1): void {
    const existant = this.panier.find(m => m.id === med.id);
  
    if (existant) {
      existant.quantite = (existant.quantite || 1) + quantite;
    } else {
      med.quantite = quantite;
      this.panier.push(med);
    }
  
    this.savePanier();
  }
  

  supprimerDuPanier(id: number): void {
    this.panier = this.panier.filter(m => m.id !== id);
    this.savePanier();
  }

  getPanier(): Medicament[] {
    return this.panier;
  }

  getNbArticles(): number {
    return this.panier.length;
  }

  viderPanier(): void {
    this.panier = [];
    localStorage.removeItem('panier');
  }
}

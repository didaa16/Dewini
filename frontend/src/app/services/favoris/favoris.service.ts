// ✅ favoris.service.ts
import { Injectable } from '@angular/core';
import { Medicament } from 'src/app/models/models_pharma/medicament.model';

@Injectable({ providedIn: 'root' })
export class FavorisService {
  private favoris: Medicament[] = [];
  private storageKey = 'favorisMedicaments';

  constructor() {
    this.chargerDepuisLocalStorage();
  }

  private sauvegarderDansLocalStorage(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.favoris));
  }

  private chargerDepuisLocalStorage(): void {
    const data = localStorage.getItem(this.storageKey);
    if (data) {
      this.favoris = JSON.parse(data);
    }
  }

  getFavoris(): Medicament[] {
    return [...this.favoris];
  }

  ajouterOuRetirer(med: Medicament): void {
    const index = this.favoris.findIndex(m => m.id === med.id);
    if (index > -1) {
      this.favoris.splice(index, 1); // retirer
    } else {
      this.favoris.push(med); // ajouter
    }
    this.sauvegarderDansLocalStorage();
  }

  estFavori(id: number): boolean {
    return this.favoris.some(m => m.id === id);
  }

  viderFavoris(): void {
    this.favoris = [];
    this.sauvegarderDansLocalStorage();
  }
}

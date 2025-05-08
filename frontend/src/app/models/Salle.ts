export class Salle {
    id: number;
    nom: string;
    capacite: number;
    exterieure: boolean; // true si extérieure, false si intérieure
    lieuId: number; // Relie la salle à un lieu
  
    constructor(id: number, nom: string, capacite: number, exterieure: boolean, lieuId: number) {
      this.id = id;
      this.nom = nom;
      this.capacite = capacite;
      this.exterieure = exterieure;
      this.lieuId = lieuId;
    }
  }
  
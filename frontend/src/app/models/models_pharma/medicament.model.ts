export interface Medicament {
    id?: number;
    nom: string;
    description: string;
    quantiteEnStock: number;
    prix: number;
    dateExpiration: string; // ou Date si tu veux formater après
    imageUrl?: string; // ✅ Ajout du champ image
    categorie?: string; // 👈 Nouveau
    quantite?: number;
    promo?: number; // <= ✅ Ajoute cette ligne
    ingredientActif?: string; // ✅ Ajouté
    notes?: number[]; // exemple : [5, 4, 3, 5]


  }
  
export interface Lieu {
  id: number;
  nom: string;
  estExterieur: boolean;
  // Si vous avez d'autres propriétés dans votre entité Java, ajoutez-les ici
  // Par exemple:
  // adresse?: string;
  // capacite?: number;
  coordonnees?: {
    latitude: number;  // Pour correspondre à la classe Coordonnees en Java
    longitude: number;
  };
}
  
import { Medicament } from './medicament.model'; // 🔁 Assure-toi que le chemin est correct

export interface Livraison {
  id?: number;
  dateLivraison: Date;
  etat: string;
  nomClient: string;
  adresse: string;

  medicaments?: Medicament[];
}

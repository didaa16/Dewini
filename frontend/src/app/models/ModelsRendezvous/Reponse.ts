// reponse.model.ts
import { Rendezvous } from 'src/app/models/ModelsRendezvous/Rendezvous'; // Importation de l'interface Rendezvous

export interface Reponse {
    idReponse?: number; // optionnel si c’est une nouvelle réponse
    contenu: string;
    statut: 'ACCEPTED' | 'REFUSED'; // enum côté TypeScript
    rendezvous: Rendezvous; // lien vers le rendez-vous parent
  }

// Enumération pour le statut de la réponse
export enum StatutReponse {
  ACCEPTED = 'ACCEPTED',
  REFUSED = 'REFUSED'
}

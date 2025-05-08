import { Evenement } from './evenement';
import { Participant } from './participant';

export enum StatutParticipation {
  INSCRIT = 'INSCRIT',
  CONFIRME = 'CONFIRME',
  ANNULE = 'ANNULE',
  REFUSE = 'REFUSE'
}

export interface Participation {
  id: number;
  evenement: Evenement;
  engagement: Participant;
  statut: StatutParticipation;
  dateInscription: Date;
  presence: boolean;
  prixPaye: number;
  evaluationNote: number;
  commentaire: string;
}
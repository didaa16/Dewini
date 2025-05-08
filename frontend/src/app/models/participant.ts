import { Evenement } from './evenement';


export enum RoleEngagement {
  ORGANISATEUR = 'ORGANISATEUR',
  SPONSOR = 'SPONSOR',
  PARTICIPANT = 'PARTICIPANT',
  INTERVENANT = 'INTERVENANT',
  BENEVOLE = 'BENEVOLE'
}

export enum TypeEngagement {
  FORMEL = 'FORMEL',
  INFORMEL = 'INFORMEL',
  SPONSOR = 'SPONSOR'
}

export enum TypeParticipant {
  ENREGISTRE = 'ENREGISTRE',
  PAYER = 'MEDECIN',
  INVITE = 'INVITE'
   // L'utilisateur est inscrit à l'événement
        // L'utilisateur est invité à l'événement
         // L'utilisateur a payé pour participer à l'événement
}

export interface Participant {
  id: number;
  evenement: Evenement;
  dateEngagement: Date;
  typeEngagement: TypeEngagement;
  role: RoleEngagement;
  type: TypeParticipant;
  qrCode?: string;
  badgeUrl?: string;
  userId: number | null;
}

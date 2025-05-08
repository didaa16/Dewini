import { CentreDeDon } from "./centre-de-don.model";
import { User } from "../FrontOffice/features/User/services/models/user";

export enum TypeDon {
  SANG = 'SANG',
  PLAQUETTES = 'PLAQUETTES',
  PLASMA = 'PLASMA',
  COEUR = 'COEUR',
  FOIE = 'FOIE',
  POUMONS = 'POUMONS',
  REINS = 'REINS',
  CORNEES = 'CORNEES',
  PANCREAS = 'PANCREAS',
  INTESTIN = 'INTESTIN'
}

export enum GroupeSanguin {
  A_POSITIF = 'A_POSITIF',
  A_NEGATIF = 'A_NEGATIF',
  B_POSITIF = 'B_POSITIF',
  B_NEGATIF = 'B_NEGATIF',
  AB_POSITIF = 'AB_POSITIF',
  AB_NEGATIF = 'AB_NEGATIF',
  O_POSITIF = 'O_POSITIF',
  O_NEGATIF = 'O_NEGATIF'
}

export enum State {
  EN_ATTENTE = 'EN_ATTENTE',
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT'
}

export interface DonDonneur {
  id: {
    donId: number;
    utilisateurId: number;
  };
  state: State;
  qrCode?: string; // Nouveau champ
  utilisateur: User;
}

export interface Don {
  idDon: number;
  donneurs: DonDonneur[]; // Changé de donneur[] à donneurs[]
  centre: CentreDeDon;
  typeDon: TypeDon;
  grpSanguin: GroupeSanguin;
  dateDon: Date;
  description: string;
  quantite: number;
}

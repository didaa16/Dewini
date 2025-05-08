
import { Participation } from './Participation';
import { Lieu } from './Lieu';
import { Salle} from './Salle';
export class Evenement {
  id!: number;
  nom!: string;
  dateDebut!: Date | string;  // Accept both Date and string
  dateFin!: Date | string;
  description!: string;
  prix!: number;
  seuilMinimum!: number;
  //lieu!: string;
  lieu?: Lieu;
  salle?: Salle;
  coordonnees?: {
    latitude: number;  // Pour correspondre à la classe Coordonnees en Java
    longitude: number;
  }= { latitude: 0, longitude: 0 };
  participations?: Participation[];

}
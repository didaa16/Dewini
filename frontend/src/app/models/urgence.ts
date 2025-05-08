import { User } from "../FrontOffice/features/User/services/models/user";
import {ConsultationUrgente} from "./consultationUrgente";
export class Urgence {
  idUrgence!: number; // ID auto-généré par le backend pour les mises à jour
  patient!: User; // obligatoire et supposé l'utilisateur connecté mais je vais initialisé id = 1 jusqu'à l'integration avec gestion utilisateur
  medecin!: User | null; // initialement null jusqu'à un médecin prend en charge l'urgence
  date!: Date; //obligatoire et date de systéme (la date de soumission du formulaire)
  description!: string; //obligatoire et text area
  addressePatient?: string; //optionnelle
  typeUrgence!: TypeUrgence; // obligatoire et liste déroulante de l'enumération TypeUrgence
  statutUrgence!: StatutUrgence; // initialement En_Attente jusqu'à un médecin prend en charge l'urgence devrait En_Cours
  consultationUrgente!: ConsultationUrgente;
  priority!: string;
  specialite!: string;
}
export enum TypeUrgence {
  A_Domicile = 'A_Domicile',
  En_Ligne = 'En_Ligne'
}
export enum StatutUrgence {
  En_Attente = 'En_Attente',
  En_Cours = 'En_Cours',
  Traite = 'Traite'
}

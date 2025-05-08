import { User } from "../FrontOffice/features/User/services/models/user";

export interface DossierMedicale {
  id_dossier: number;
  patient: User;
  dateCreation: string;
  antecedentsMedicaux: string;
  allergies: string;
  traitementsEnCours: string;
}

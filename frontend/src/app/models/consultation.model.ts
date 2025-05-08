import { User } from "../FrontOffice/features/User/services/models/user";
import { DossierMedicale } from './dossier-medicale.model';

export interface Consultation {
  id_consultation?: number;
  date: string;
  heure: string;
  rapport: string;
  recommandations: string;
  medecin?: User;       // Info médecin
  patient_id?: number;  // ID du patient (important)
  patient?: User;       // Info patient (optionnel)
  dossierMedical_id?: number;
  dossierMedical?: DossierMedicale;
}

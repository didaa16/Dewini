import { Prescription } from './prescription.model';

export interface Ordonnance {
  id?: number;
  dateEmission?: string;
  instructions: string;
  medecinId: number;
  patientId: number;
  prescriptions: Prescription[];
  lienPdf?: string; // ✅ Ajouté ici !
  signature?: string; // ✅ Ajoute ceci pour éviter l'erreur dans le HTML
  commentaire?: string; // ✅ Champ ajouté
  dateAjout?: string; // 🆕 Ajouté ici
}

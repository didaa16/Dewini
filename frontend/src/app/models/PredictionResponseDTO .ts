export interface PredictionResponseDTO {
    participant_id: number;
    evenement_id: number;
    prix: number;
    salle: number;
    lieu: number;
    nom: string;
    prix_paye: number;
    statut: number;
    type_engagement: number;
    role: number;
    type_participant: number;
    attendance_likelihood: number;
    predicted_attendance: boolean;
    suggestions: string[];
  }
  
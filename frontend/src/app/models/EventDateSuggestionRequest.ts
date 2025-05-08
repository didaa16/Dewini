export interface EventDateSuggestionRequest {
  nom: string;
  dateDebut: string; // YYYY-MM-DD HH:MM
  dateFin: string; // YYYY-MM-DD HH:MM
  prix: number;
  seuilMinimum: number;
}
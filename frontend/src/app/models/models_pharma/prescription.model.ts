import { Medicament } from './medicament.model';

export interface Prescription {
  medicament: Partial<Medicament>; // Allow partial Medicament object
  posologie: string;
  duree: string;
}

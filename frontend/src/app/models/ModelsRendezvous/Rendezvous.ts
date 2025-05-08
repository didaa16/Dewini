import { Reponse } from 'src/app/models/ModelsRendezvous/Reponse'; // Importation de l'interface Rendezvous

// rendezvous.model.ts
export interface Rendezvous {
    idRendezvous?: number; // L'ID du rendez-vous, facultatif lors de l'ajout
    nomPatient: string; // Nom du patient
    dateNaissance: string; // Date de naissance du patient (format ISO-8601)
    dateRendezvous: string; // Date du rendez-vous (format ISO-8601)
    heureRendezvous: string;
    emailPatient: string; // Heure du rendez-vous 
    medicalState: string; 
    sexePatient: 'HOMME' | 'FEMME'; // Sexe du patient (HOMME ou FEMME)
    reponses?: Reponse[]; // Liste des réponses associées au rendez-vous (facultatif, pour les relations avec Reponse)
  }

  
  
  // Enumération pour le sexe du patient
  export enum SexePatient {
    HOMME = 'HOMME',
    FEMME = 'FEMME'
  }
  
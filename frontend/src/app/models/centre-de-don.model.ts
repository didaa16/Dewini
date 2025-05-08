export enum Statut {
  DISPONIBLE = 'DISPONIBLE',
  OCCUPE = 'OCCUPE'
}

export interface CentreDeDon {
  idCentre: number;
  nom: string;
  adresse: string;
  telephone: string;
  codePostal: string;
  email: string;
  capaciteMaximale: number;
  capaciteActuelle: number;
  imgcentre: string;
  statusCentre: Statut;
  [key: string]: any; // Ajoutez cette ligne pour autoriser l'accès par chaîne

}
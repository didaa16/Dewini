export interface Page<T> {
    content: T[];          // Les éléments de la page actuelle
    totalElements: number; // Nombre total d'éléments
    totalPages: number;    // Nombre total de pages
    size: number;          // Nombre d'éléments par page
    number: number;        // Numéro de la page actuelle (0-based)
    first: boolean;        // Si c'est la première page
    last: boolean;         // Si c'est la dernière page
    empty: boolean;        // Si la page est vide
  }
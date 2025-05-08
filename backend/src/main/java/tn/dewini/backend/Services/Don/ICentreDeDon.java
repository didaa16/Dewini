package tn.dewini.backend.Services.Don;

import tn.dewini.backend.Entities.Don.CentreDeDon;
import java.util.List;

public interface ICentreDeDon {

    // Méthode pour récupérer tous les centres de dons
    List<CentreDeDon> retrieveAllCentresDeDon();

    // Méthode pour récupérer un centre de don par son ID
    CentreDeDon retrieveCentreDeDon(int centreDeDonId);

    // Méthode pour ajouter un nouveau centre de don
    CentreDeDon addCentreDeDon(CentreDeDon centreDeDon);

    // Méthode pour supprimer un centre de don par son ID
    void removeCentreDeDon(int centreDeDonId);

    // Méthode pour modifier un centre de don
    CentreDeDon modifyCentreDeDon(CentreDeDon centreDeDon);

    // D'autres méthodes personnalisées peuvent être ajoutées plus tard
    // Exemple: Recherche de centres de dons par localisation, par statut, etc.
}

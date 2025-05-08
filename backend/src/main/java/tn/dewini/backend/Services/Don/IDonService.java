package tn.dewini.backend.Services.Don;

import tn.dewini.backend.Entities.Don.Don;
import tn.dewini.backend.Entities.Don.State;

import java.util.List;
import java.util.Map;

public interface IDonService {
    List<Don> retrieveAllDons();
    Don retrieveDon(Long donId);
    Don addDon(Don don);
    void removeDon(Long donId);
    Don modifyDon(Don don);
    Don addDonneurToDon(Long donId, Integer utilisateurId);
    Don updateDonneurState(Long donId, Integer utilisateurId, State newState);
    List<Don> getDonsPourUtilisateurProche(Integer idUtilisateur);
    boolean verifierCapaciteCentre(int centreId);
    Map<String, Object> getDonPredictions(String typeDon, String grpSanguin, int daysAhead);
}
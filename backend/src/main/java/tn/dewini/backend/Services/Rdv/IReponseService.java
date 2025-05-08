package tn.dewini.backend.Services.Rdv;

import tn.dewini.backend.Entities.Rdv.Reponse;

import java.util.List;
import java.util.Map;

public interface IReponseService {
    List<Reponse> retrieveAllReponse();
    Reponse retrieveReponse(Long idReponse);
    Reponse addReponse(Reponse reponse);
    void removeReponse(Long idReponse);
    Reponse modifyReponse(Reponse reponse);
    boolean existsByRendezvousId(Long rendezvousId);
    Reponse updateEtatReponse(Long idReponse, Reponse.EtatTraitement etat);
    long countByEtat(Reponse.EtatTraitement etat);
    Map<String, Long> getRendezVousStats();
    Map<String, Long> getRendezVousCountStats();
    Reponse saveReponse(Reponse reponse);

}

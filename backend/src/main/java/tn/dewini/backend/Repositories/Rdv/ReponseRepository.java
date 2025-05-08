package tn.dewini.backend.Repositories.Rdv;

import tn.dewini.backend.Entities.Rdv.Reponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ReponseRepository extends JpaRepository<Reponse, Long> {
    boolean existsByRendezvousIdRendezvous(Long rendezvousId);

    long countByEtat(Reponse.EtatTraitement etat);
    @Query("SELECT COUNT(r) FROM Rendezvous r WHERE EXISTS " +
            "(SELECT 1 FROM Reponse rep WHERE rep.rendezvous.idRendezvous = r.idRendezvous)")
    long countRendezVousWithReponse();

    @Query("SELECT COUNT(r) FROM Rendezvous r WHERE NOT EXISTS " +
            "(SELECT 1 FROM Reponse rep WHERE rep.rendezvous.idRendezvous = r.idRendezvous)")
    long countRendezVousWithoutReponse();

}


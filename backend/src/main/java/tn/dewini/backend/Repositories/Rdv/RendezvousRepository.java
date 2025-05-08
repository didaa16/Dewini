package tn.dewini.backend.Repositories.Rdv;

import tn.dewini.backend.Entities.Rdv.Rendezvous;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RendezvousRepository extends JpaRepository<Rendezvous, Long> {
    List<Rendezvous> findByDateRendezvous(LocalDate dateRendezvous);


    // Nouvelle méthode pour vérifier les chevauchements
    // Version corrigée de la méthode
    @Query("SELECT r FROM Rendezvous r WHERE "
            + "r.dateRendezvous = :date AND "
            + "ABS(FUNCTION('TIMESTAMPDIFF', MINUTE, "
            + "FUNCTION('STR_TO_DATE', CONCAT(r.dateRendezvous, ' ', r.heureRendezvous), '%Y-%m-%d %H:%i'), "
            + "FUNCTION('STR_TO_DATE', CONCAT(:date, ' ', :heure), '%Y-%m-%d %H:%i'))) < 30")
    List<Rendezvous> findOverlappingSlots(@Param("date") LocalDate date,
                                          @Param("heure") String heure);
}


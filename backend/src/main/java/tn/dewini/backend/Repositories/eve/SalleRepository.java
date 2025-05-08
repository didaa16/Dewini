package tn.dewini.backend.Repositories.eve;

import org.springframework.data.jpa.repository.Query;
import tn.dewini.backend.Entities.eve.Salle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface SalleRepository extends JpaRepository<Salle, Long> {
    List<Salle> findByCapaciteGreaterThanEqual(int capacite);
    @Query("SELECT s FROM Salle s WHERE s.lieu.estExterieur = :estExterieur " +
            "AND s.capacite >= :capacite " +
            "AND s.id NOT IN (SELECT e.salle.id FROM Evenement e WHERE e.dateDebut <= :dateFin AND e.dateFin >= :dateDebut)")
    Optional<Salle> findAvailableSalle(boolean estExterieur, int capacite, LocalDateTime dateDebut, LocalDateTime dateFin);
}

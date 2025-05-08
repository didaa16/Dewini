package tn.dewini.backend.Repositories.eve;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.dewini.backend.Entities.eve.Evenement;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface EvenementRepository extends JpaRepository<Evenement, Long> {
    List<Evenement> findByDateDebutAfter(LocalDateTime dateDebut);
    @Override
    @EntityGraph(attributePaths = {"participations"}) // Charge les participations avec l'événement
    Optional<Evenement> findById(Long id);
    @Query("SELECT e FROM Evenement e LEFT JOIN FETCH e.participations WHERE e.id = :id")
    Optional<Evenement> findByIdWithParticipations(@Param("id") Long id);

    @Query("SELECT e FROM Evenement e LEFT JOIN FETCH e.participations WHERE e.dateDebut < CURRENT_TIMESTAMP")
    List<Evenement> findEvenementsAVerifier();

    // Récupère les événements avec coordonnées valides
    @Query("SELECT e FROM Evenement e WHERE e.coordonnees IS NOT NULL")
    List<Evenement> findEvenementsWithCoordinates();

    // Récupère un événement avec ses relations
    @Query("SELECT e FROM Evenement e LEFT JOIN FETCH e.lieu LEFT JOIN FETCH e.salle WHERE e.id = :id")
    Optional<Evenement> findEvenementDetails(@Param("id") Long id);

    // Trouve les événements proches d'une position
    @Query(value = """
        SELECT e FROM Evenement e 
        WHERE FUNCTION('ST_Distance_Sphere', 
            FUNCTION('POINT', e.coordonnees.longitude , e.coordonnees.latitude), 
            FUNCTION('POINT', :lng, :lat)) < :radius
        """)
    List<Evenement> findNearbyEvents(
            @Param("lat") double lat,
            @Param("lng") double lng,
            @Param("radius") double radius);
    @Query("SELECT e FROM Evenement e WHERE e.dateDebut BETWEEN :now AND :nowPlus2")
    List<Evenement> findByDateDebutProche(@Param("now") LocalDateTime now, @Param("nowPlus2") LocalDateTime nowPlus2);



}

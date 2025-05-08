package tn.dewini.backend.Repositories.Urgence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.dewini.backend.Entities.Urgence.StatutUrgence;
import tn.dewini.backend.Entities.Urgence.TypeUrgence;
import tn.dewini.backend.Entities.Urgence.Urgence;
import tn.dewini.backend.Entities.User.User;

import java.util.Date;
import java.util.List;

@Repository
public interface UrgenceRepository extends JpaRepository<Urgence, Long> {
    // No need to code CRUD here. It is already provided by the Spring Data JPA interfaces:
    // - CrudRepository
    // - PagingAndSortingRepository
    // - JpaRepository
    @Query("SELECT u FROM Urgence u ORDER BY CASE u.priority " +
            "WHEN 'Critique' THEN 1 " +
            "WHEN 'Moyen' THEN 2 " +
            "WHEN 'Faible' THEN 3 " +
            "ELSE 4 END")
    List<Urgence> findAllOrderByPriority();

    @Query("SELECT u FROM Urgence u " +
            "WHERE u.statutUrgence = 'En_Attente' OR u.statutUrgence = 'En_Cours' " +
            "ORDER BY CASE u.priority " +
            "WHEN 'Critique' THEN 1 " +
            "WHEN 'Moyen' THEN 2 " +
            "WHEN 'Faible' THEN 3 " +
            "ELSE 4 END")
    List<Urgence> findAllWithoutTreated();

    @Query("SELECT u FROM Urgence u JOIN u.consultationUrgente c WHERE c.idConsultationUrgente = :consultationId")
    Urgence findByConsultationUrgenteId(@Param("consultationId") Long consultationId);



    //STATS
    Long countByStatutUrgenceAndDateBetween(StatutUrgence statutUrgence, Date startDate, Date endDate);

    @Query("SELECT u.typeUrgence, COUNT(u) FROM Urgence u GROUP BY u.typeUrgence")
    List<Object[]> countUrgencesByType();

    @Query("SELECT u.statutUrgence, COUNT(u) FROM Urgence u GROUP BY u.statutUrgence")
    List<Object[]> countUrgencesByStatut();



    //CARTE THERMIQUE
    List<Urgence> findUrgenceByTypeUrgence(TypeUrgence typeUrgence);



    @Query("SELECT u FROM Urgence u WHERE u.patient.id = :patientId")
    List<Urgence> getUrgencesByPatientId(@Param("patientId") Integer patientId);



}

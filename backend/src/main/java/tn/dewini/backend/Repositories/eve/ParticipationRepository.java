package tn.dewini.backend.Repositories.eve;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.dewini.backend.Entities.eve.Participant;
import tn.dewini.backend.Entities.eve.Participation;

import java.util.List;
import java.util.Optional;


@Repository
public interface ParticipationRepository extends JpaRepository<Participation, Long> {
    // Méthodes personnalisées si nécessaire
    long countByPresenceTrue();
    Participation findByEngagementId(Long participantId);
    List<Participation> findByEngagement(Participant participant);

    @Query("SELECT p FROM Participation p JOIN FETCH p.engagement JOIN FETCH p.evenement WHERE p.id = :id")
    Optional<Participation> findByIdWithRelations(@Param("id") Long id);
    List<Participation> findByEvenementId(Long evenementId);
    @Modifying
    @Transactional
    @Query("DELETE FROM Participation p WHERE p.engagement.id = :participantId")
    void deleteByParticipantId(@Param("participantId") Long participantId);
}

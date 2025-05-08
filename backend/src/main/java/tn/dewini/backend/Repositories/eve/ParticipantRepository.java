package tn.dewini.backend.Repositories.eve;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import tn.dewini.backend.Entities.eve.Participant;

import java.util.List;


@Repository
public interface ParticipantRepository extends JpaRepository<Participant, Long>, JpaSpecificationExecutor<Participant> {
    // Méthodes personnalisées si nécessaire
    List<Participant> findByEvenementId(Long eventId);
}




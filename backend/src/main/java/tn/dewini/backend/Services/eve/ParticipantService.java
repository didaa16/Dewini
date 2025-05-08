package tn.dewini.backend.Services.eve;
import org.springframework.data.domain.Page;
import tn.dewini.backend.Entities.eve.Participant;
import tn.dewini.backend.Entities.eve.ParticipantDTO;
import tn.dewini.backend.Entities.eve.ParticipantFilterDTO;

import java.util.List;




public interface ParticipantService {
    List<Participant> retrieveAllEngagements();
    Participant retrieveEngagementById(Long engagementId);
    Participant addEngagement(Participant engagement);
    void removeEngagement(Long engagementId);
    Participant modifyEngagement(Participant engagement);
    Participant create(Participant participant);
    Page<Participant> findAll(ParticipantFilterDTO filter);
    ParticipantDTO updateParticipant(Long id, ParticipantDTO participantDTO);

}

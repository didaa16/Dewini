package tn.dewini.backend.Services.eve;

import tn.dewini.backend.Entities.eve.InscriptionRequest;
import tn.dewini.backend.Entities.eve.Participation;

import java.util.List;
import java.util.Map;


public interface ParticipationService {
    List<Participation> retrieveAllParticipations();
    Participation retrieveParticipationById(Long participationId);
    Participation addParticipation(Participation participation);
    void removeParticipation(Long participationId);
    Participation modifyParticipation(Participation participation);
    Map<String, Object> getParticipationStats();
     Participation inscrireParticipant(InscriptionRequest request);
    List<Participation> getParticipationsByEvent(Long eventId);


    List<Participation> getParticipationsByEvenementId(Long evenementId);
}

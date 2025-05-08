package tn.dewini.backend.Services.eve;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.dewini.backend.Entities.eve.*;
import tn.dewini.backend.Repositories.eve.EvenementRepository;
import tn.dewini.backend.Repositories.eve.ParticipantRepository;
import tn.dewini.backend.Repositories.eve.ParticipationRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Service
@AllArgsConstructor
public class ParticipationServiceImpl implements ParticipationService {
    @Autowired
    ParticipationRepository participationRepository;
    @Autowired
    ParticipantRepository participantRepository;
    @Autowired
    EvenementRepository evenementRepository;
    @Override
    public List<Participation> retrieveAllParticipations() {
        return participationRepository.findAll();
    }

    @Override
    public Participation retrieveParticipationById(Long participationId) {
        return participationRepository.findById(participationId).orElse(null);
    }

    @Override
    public Participation addParticipation(Participation participation) {
        return participationRepository.save(participation);
    }

    @Override
    public void removeParticipation(Long participationId) {
        participationRepository.deleteById(participationId);
    }

    @Override
    public Participation modifyParticipation(Participation participation) {
        return participationRepository.save(participation);
    }
    @Override
    public Map<String, Object> getParticipationStats() {
        List<Participation> participations = participationRepository.findAll();
        Map<String, Object> stats = new HashMap<>();

        // Nombre total de participations
        stats.put("totalParticipations", participations.size());

        // Répartition par statut
        Map<String, Long> statusCount = participations.stream()
                .collect(Collectors.groupingBy(p -> p.getStatut().name(), Collectors.counting()));
        stats.put("statusDistribution", statusCount);

        // Taux de présence
        long presenceCount = participations.stream().filter(Participation::isPresence).count();
        double presenceRate = participations.isEmpty() ? 0 : (double) presenceCount / participations.size();
        stats.put("presenceRate", presenceRate);

        // Prix payé moyen
        double averagePrixPaye = participations.stream()
                .mapToDouble(p -> p.getPrixPaye().doubleValue())
                .average()
                .orElse(0.0);
        stats.put("averagePrixPaye", averagePrixPaye);

        return stats;
    }
    @Override
    public Participation inscrireParticipant(InscriptionRequest request) {
        Evenement evenement = evenementRepository.findById(request.getEvenementId())
                .orElseThrow(() -> new RuntimeException("Événement introuvable"));

        Participant participant = new Participant();
        participant.setEvenement(evenement);
        participant.setDateEngagement(LocalDateTime.now());
        participant.setTypeEngagement(request.getTypeEngagement());
        participant.setRole(request.getRole());
        participant.setType(request.getType());
        participantRepository.save(participant);

        Participation participation = new Participation();
        participation.setEvenement(evenement);
        participation.setEngagement(participant);
        participation.setStatut(StatutParticipation.INSCRIT); // ou EN_ATTENTE_PAIEMENT
        participation.setDateInscription(LocalDateTime.now());
        participation.setPresence(false);
        participation.setPrixPaye(BigDecimal.valueOf(0));

        participation.setEvaluationNote(0);
        participation.setCommentaire("");
        participationRepository.save(participation);

        return participation;
    }
    public List<Participation> getParticipationsByEvent(Long eventId) {
        return participationRepository.findByEvenementId(eventId);
    }
    public List<Participation> getParticipationsByEvenementId(Long evenementId) {
        return participationRepository.findByEvenementId(evenementId);
    }
}

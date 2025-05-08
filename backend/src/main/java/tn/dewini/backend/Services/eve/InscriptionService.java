package tn.dewini.backend.Services.eve;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.dewini.backend.Entities.User.User;
import tn.dewini.backend.Entities.eve.*;
import tn.dewini.backend.Repositories.User.UserRepo;
import tn.dewini.backend.Repositories.eve.EvenementRepository;
import tn.dewini.backend.Repositories.eve.ParticipantRepository;
import tn.dewini.backend.Repositories.eve.ParticipationRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service

@Transactional
public class InscriptionService {

    @Autowired
   ParticipantRepository participantRepo;
    @Autowired
 ParticipationRepository participationRepo;
    @Autowired
 EvenementRepository evenementRepo;
    @Autowired
     PaiementService paiementService;
    @Autowired
    UserRepo userRepo;
@Autowired
    UserRepo utilisateurRepository;

    public InscriptionResponse processInscription(InscriptionRequest request) {
        // Validation

        if (request == null || request.getUserId() == null) {
            throw new IllegalArgumentException("Paramètres invalides");
        }

        // Récupération des entités
        Evenement evenement = evenementRepo.findById(request.getEvenementId())
                .orElseThrow(() -> new RuntimeException("Événement introuvable"));

        User user = utilisateurRepository.findById( request.getUserId())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        // Création du participant
        Participant participant = new Participant();
        participant.setEvenement(evenement);
        participant.setUser(user); // Association correcte de l'utilisateur
        participant.setDateEngagement(LocalDateTime.now());
        participant.setTypeEngagement(request.getTypeEngagement());
        participant.setRole(request.getRole());
        participant.setType(request.getType());

        Participant savedParticipant = participantRepo.save(participant);

        // Création de la participation
        Participation participation = new Participation();
        participation.setEvenement(evenement);
        participation.setEngagement(savedParticipant); // Note: changé de setEngagement à setParticipant
        participation.setStatut(StatutParticipation.INSCRIT);
        participation.setDateInscription(LocalDateTime.now());
        participation.setPresence(false);
        participation.setPrixPaye(BigDecimal.ZERO);

        // Gestion du paiement
        if (request.getType() == TypeParticipant.PAYER && evenement.getPrix().compareTo(BigDecimal.ZERO) > 0) {
            participationRepo.save(participation);
            String sessionUrl = paiementService.creerSessionPaiement(savedParticipant, evenement);
            return new InscriptionResponse(true, sessionUrl);
        }

        participation.setStatut(StatutParticipation.CONFIRME);
        participationRepo.save(participation);
        return new InscriptionResponse(false, null);
    }

}

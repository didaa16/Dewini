package tn.dewini.backend.Services.eve;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.dewini.backend.Repositories.eve.EvenementRepository;
import tn.dewini.backend.Repositories.eve.ParticipantRepository;
import tn.dewini.backend.Repositories.eve.ParticipationRepository;
import tn.dewini.backend.Entities.eve.Evenement;


import java.util.List;

import tn.dewini.backend.Entities.eve.ParticipantDTO;
import tn.dewini.backend.Entities.eve.ParticipantFilterDTO;
import tn.dewini.backend.Entities.eve.Participant;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;

@Service
@AllArgsConstructor
public class ParticipantServiceImpl implements ParticipantService {
    @Autowired
    ParticipantRepository eventEngagementRepository;

     EvenementService evenementService;
    @Autowired
    // ParticipantService.java
   EvenementRepository evenementRepository;
        @Autowired
     QRCodeService qrCodeService;
    @Autowired
  ParticipantRepository participantRepository;
    @Autowired
 ParticipationRepository participationRepository;

        // Retirer UtilisateurService du constructeur


    @Override
    public ParticipantDTO updateParticipant(Long id, ParticipantDTO participantDTO) {
        Participant participant = participantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Participant non trouvé avec id: " + id));

        if (participantDTO.getEvenementId() != null) {
            participant.setEvenement(
                    evenementRepository.findById(participantDTO.getEvenementId())
                            .orElseThrow(() -> new RuntimeException("Evenement non trouvé avec id: " + participantDTO.getEvenementId()))
            );
        }

        if (participantDTO.getDateEngagement() != null) {
            participant.setDateEngagement(participantDTO.getDateEngagement());
        }

        if (participantDTO.getRole() != null) {
            participant.setRole(participantDTO.getRole());
        }

        if (participantDTO.getTypeEngagement() != null) {
            participant.setTypeEngagement(participantDTO.getTypeEngagement());
        }

        if (participantDTO.getType() != null) {
            participant.setType(participantDTO.getType());
        }

        Participant updated = participantRepository.save(participant);

        // Transformer en DTO pour la réponse
        ParticipantDTO updatedDTO = new ParticipantDTO();
        updatedDTO.setId(updated.getId());
        updatedDTO.setEvenementId(updated.getEvenement().getId());
        updatedDTO.setDateEngagement(updated.getDateEngagement());
        updatedDTO.setRole(updated.getRole());
        updatedDTO.setTypeEngagement(updated.getTypeEngagement());
        updatedDTO.setType(updated.getType());

        return updatedDTO;
    }
    @Override
    public List<Participant> retrieveAllEngagements() {
        return eventEngagementRepository.findAll();
    }



    public Page<Participant> findAll(ParticipantFilterDTO filter) {
        Specification<Participant> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter.getRole() != null) {
                predicates.add(cb.equal(root.get("role"), filter.getRole()));
            }

            if (filter.getType() != null) {
                predicates.add(cb.equal(root.get("type"), filter.getType()));
            }

            if (filter.getEngagement() != null) {
                predicates.add(cb.equal(root.get("typeEngagement"), filter.getEngagement()));
            }

            if (filter.getSearch() != null && !filter.getSearch().isEmpty()) {
                predicates.add(cb.or(
                        cb.like(root.get("evenement").get("nom"), "%" + filter.getSearch() + "%"),
                        cb.like(root.get("evenement").get("description"), "%" + filter.getSearch() + "%")
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };


        return eventEngagementRepository.findAll(spec, PageRequest.of(filter.getPage(), filter.getSize()));
    }

    public Participant create(Participant participant) {
        participant.setId(null);

        // Validate and fetch the Evenement
        if (participant.getEvenement() == null || participant.getEvenement().getId() == null) {
            throw new IllegalArgumentException("L'événement associé au participant est requis.");
        }

        Evenement evenement = evenementRepository.findById(participant.getEvenement().getId())
                .orElseThrow(() -> new IllegalArgumentException("Événement non trouvé avec l'ID: " + participant.getEvenement().getId()));
        participant.setEvenement(evenement);

        // Save the participant
        return participantRepository.save(participant);
    }
    @Override
    public Participant retrieveEngagementById(Long engagementId) {
        return eventEngagementRepository.findById(engagementId).orElse(null);
    }

    @Override
    public Participant addEngagement(Participant engagement) {
        return eventEngagementRepository.save(engagement);
    }

    @Override
    public void removeEngagement(Long engagementId) {

            // Vérifier d'abord si le participant existe
            if (!participantRepository.existsById(engagementId)) {
                throw new EntityNotFoundException("Participant non trouvé");
            }

            // Supprimer d'abord toutes les participations liées
            participationRepository.deleteByParticipantId(engagementId);

            // Puis supprimer le participant
            participantRepository.deleteById(engagementId);

    }

    @Override
    public Participant modifyEngagement(Participant engagement) {
        return eventEngagementRepository.save(engagement);
    }


    }




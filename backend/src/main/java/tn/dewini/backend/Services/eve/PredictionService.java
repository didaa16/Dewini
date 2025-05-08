package tn.dewini.backend.Services.eve;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import tn.dewini.backend.Entities.eve.ParticipantInputDTO;
import tn.dewini.backend.Entities.eve.PredictionResponseDTO;
import tn.dewini.backend.Entities.eve.Evenement;
import tn.dewini.backend.Entities.eve.Participant;
import tn.dewini.backend.Entities.eve.Participation;

@Service
public class PredictionService {

    private final RestTemplate restTemplate;
    private static final String PREDICTION_API_URL = "http://localhost:8002/predict_attendance";
    private static final Logger logger = LoggerFactory.getLogger(PredictionService.class);
    @Autowired
    public PredictionService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public PredictionResponseDTO predictAttendance(Participation participation) {

        try {
            logger.info("Processing prediction for participation ID: {}", participation.getId());
            Participant participant = participation.getEngagement();
            Evenement evenement = participation.getEvenement();

            // Validate entities and IDs
            if (participation == null || participation.getId() == null) {
                logger.error("Participation is null or has no ID");
                throw new IllegalStateException("Participation cannot be null or have no ID");
            }
            if (participant == null || participant.getId() == null) {
                logger.error("Participant or Participant ID is null for participation ID: {}", participation.getId());
                throw new IllegalStateException("Participant or Participant ID cannot be null");
            }
            if (evenement == null || evenement.getId() == null) {
                logger.error("Evenement or Evenement ID is null for participation ID: {}", participation.getId());
                throw new IllegalStateException("Evenement or Evenement ID cannot be null");
            }

            // Log entity details
            logger.info("Participant ID: {}, TypeEngagement: {}, Role: {}, Type: {}",
                    participant.getId(), participant.getTypeEngagement(), participant.getRole(), participant.getType());
            logger.info("Evenement ID: {}, Nom: {}, Prix: {}, Salle: {}, Lieu: {}",
                    evenement.getId(), evenement.getNom(), evenement.getPrix(),
                    evenement.getSalle() != null ? evenement.getSalle().getNom() : null,
                    evenement.getLieu() != null ? evenement.getLieu().getNom() : null);

            // Map salle and lieu
            String salleNom = mapSalleToValidCategory(evenement.getSalle() != null ? evenement.getSalle().getNom() : null);
            String lieuNom = mapLieuToValidCategory(evenement.getLieu() != null ? evenement.getLieu().getNom() : null);

            // Build DTO
            ParticipantInputDTO inputDTO = new ParticipantInputDTO(
                    participant.getId(),
                    evenement.getId(),
                    evenement.getPrix() != null ? evenement.getPrix().floatValue() : 0.0f,
                    salleNom,
                    lieuNom,
                    evenement.getNom() != null ? evenement.getNom() : "Unknown Event",
                    participation.getPrixPaye() != null ? participation.getPrixPaye().floatValue() : 0.0f,
                    participation.getStatut() != null ? participation.getStatut().name() : "INSCRIT",
                    participant.getTypeEngagement() != null ? participant.getTypeEngagement().name() : "INFORMEL",
                    participant.getRole() != null ? participant.getRole().name() : "PARTICIPANT",
                    participant.getType() != null ? participant.getType().name() : "ENREGISTRE"
            );

            logger.info("Sending ParticipantInputDTO: {}", inputDTO);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<ParticipantInputDTO> request = new HttpEntity<>(inputDTO, headers);

            PredictionResponseDTO response = restTemplate.postForObject(PREDICTION_API_URL, request, PredictionResponseDTO.class);
            logger.info("Prediction response received: {}", response);
            return response;
        } catch (RestClientException e) {
            logger.error("Failed to call prediction API: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to call prediction API: " + e.getMessage(), e);
        } catch (Exception e) {
            logger.error("Unexpected error in predictAttendance: {}", e.getMessage(), e);
            throw new RuntimeException("Unexpected error: " + e.getMessage(), e);
        }
    }
    private String mapSalleToValidCategory(String rawSalle) {
        if (rawSalle == null) {
            logger.warn("Salle is null, defaulting to 'Salle A'");
            return "Salle A";
        }
        String lowerSalle = rawSalle.toLowerCase();
        if (lowerSalle.contains("salle a")) return "Salle A";
        if (lowerSalle.contains("salle b")) return "Salle B";
        if (lowerSalle.contains("salle c")) return "Salle C";
        if (lowerSalle.contains("salle d")) return "Salle D";
        logger.warn("Unknown salle '{}', defaulting to 'Salle A'", rawSalle);
        return "Salle A";
    }

    private String mapLieuToValidCategory(String rawLieu) {
        if (rawLieu == null) {
            logger.warn("Lieu is null, defaulting to 'Centre Ville'");
            return "Centre Ville";
        }
        String lowerLieu = rawLieu.toLowerCase();
        if (lowerLieu.contains("centre") || lowerLieu.contains("ville")) return "Centre Ville";
        if (lowerLieu.contains("campus")) return "Campus";
        if (lowerLieu.contains("parc")) return "Parc";
        if (lowerLieu.contains("hotel")) return "Hotel";
        logger.warn("Unknown lieu '{}', defaulting to 'Centre Ville'", rawLieu);
        return "Centre Ville";
    }
}
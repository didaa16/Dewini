package tn.dewini.backend.Controllers.eve;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.dewini.backend.Repositories.eve.ParticipationRepository;
import tn.dewini.backend.Services.eve.ParticipationService;
import tn.dewini.backend.Entities.eve.PredictionResponseDTO;
import tn.dewini.backend.Entities.eve.Participation;
import tn.dewini.backend.Services.eve.PredictionService;


@RestController
@RequestMapping("/api/predictions")
public class PredictionController {
    @Autowired
    private ParticipationRepository participationRepository;
    private static final Logger logger = LoggerFactory.getLogger(PredictionService.class);
    private final PredictionService predictionService;
    private final ParticipationService participationService;

    @Autowired
    public PredictionController(PredictionService predictionService, ParticipationService participationService) {
        this.predictionService = predictionService;
        this.participationService = participationService;
    }

    @GetMapping("/predict-attendance/{id}")
    public PredictionResponseDTO predictAttendance(@PathVariable Long id) {

        logger.info("Fetching participation with ID: {}", id);
        Participation participation = participationRepository.findByIdWithRelations(id)
                .orElseThrow(() -> new RuntimeException("Participation not found for ID: " + id));
        return predictionService.predictAttendance(participation);
    }
}
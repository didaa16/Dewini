package tn.dewini.backend.Controllers.eve;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.dewini.backend.Entities.eve.Evenement;
import tn.dewini.backend.Entities.eve.Participant;
import tn.dewini.backend.Entities.eve.Participation;
import tn.dewini.backend.Entities.eve.ParticipationDTO;

import lombok.AllArgsConstructor;
import tn.dewini.backend.Services.eve.*;


@CrossOrigin(origins = "http://localhost:4200")
@Tag(name = "Gestion Evenement", description = "API pour la gestion des événements")
@RestController
@AllArgsConstructor
@RequestMapping("/evenement")
public class EvenementController {

    @Autowired
    private EvenementService evenementService;
    @Autowired
    private ParticipantService participantService;
    @Autowired
    private ParticipationService participationService;
    @Autowired
    LieuSelectionService lieuSelectionService;
    @Autowired
    private WeatherService weatherService;


    @Operation(summary = "Récupérer tous les événements", description = "Cette méthode permet de récupérer la liste de tous les événements.")
    @GetMapping("/retrieve-all-evenements")
    public List<Evenement> getAllEvenements() {
        return evenementService.retrieveAllEvenements();
    }

    @Operation(summary = "Récupérer un événement par ID", description = "Cette méthode permet de récupérer un événement spécifique en fournissant son ID.")
    @GetMapping("/retrieve-evenement/{id}")
    public Evenement getEvenementById(@PathVariable Long id) {
        return evenementService.retrieveEvenementById(id);
    }

    @Operation(summary = "Ajouter un nouvel événement", description = "Cette méthode permet d'ajouter un nouvel événement.")
    @PostMapping("/add-evenement")
    public ResponseEntity<?> addEvenement(@RequestBody Evenement evenement ) {
        try {
            // Conversion des dates si nécessaire (selon votre format frontend)
            if (evenement.getDateDebut() == null && evenement.getDateFin() == null) {
                // Exemple de conversion si les dates viennent comme String
                // evenement.setDateDebut(LocalDateTime.parse(evenementDto.getDateDebutString()));
            }

            Evenement savedEvent = evenementService.addEvenement(evenement);
            return ResponseEntity.ok(savedEvent);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "error", "Validation Error",
                            "message", e.getMessage(),
                            "timestamp", LocalDateTime.now()
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    Map.of(
                            "error", "Server Error",
                            "message", e.getMessage(),
                            "timestamp", LocalDateTime.now()
                    )
            );
        }
    }


    @Operation(summary = "Modifier un événement", description = "Cette méthode permet de modifier un événement existant.")
    @PutMapping("/modify-evenement/{id}")
    public ResponseEntity<?> modifyEvenement(
            @PathVariable Long id,
            @RequestBody Evenement evenementDetails) {

        try {
            Evenement updated = evenementService.modifyEvenement(id, evenementDetails);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Erreur: " + e.getMessage());
        }
    }

    @Operation(summary = "Supprimer un événement", description = "Cette méthode permet de supprimer un événement en fournissant son ID.")
    @DeleteMapping("/remove-evenement/{id}")
    public void removeEvenement(@PathVariable Long id) {
        evenementService.removeEvenement(id);
    }
    @Operation(summary = "Récupérer les événements à venir", description = "Cette méthode permet de récupérer les événements à venir.")
    @GetMapping("/upcoming")
    public List<Evenement> getUpcomingEvenements() {
        return evenementService.retrieveUpcomingEvenements(); // Implémenter cette méthode dans le service
    }


    // Gestion des participations
    @GetMapping("/participations/stats")
    public Map<String, Object> getParticipationStats() {
        return participationService.getParticipationStats();
    }

    @PostMapping("/participants")
    public Participant addParticipant(@RequestBody Participant participant) {
        return participantService.addEngagement(participant);
    }

    @PostMapping("/participations")
    public Participation addParticipation(@RequestBody Participation participation) {
        return participationService.addParticipation(participation);
    }
    @PostMapping("/register/{evenementId}")
    public ResponseEntity<Participation> register(@PathVariable Long evenementId, @RequestBody Participant participant) {
        Participation p = evenementService.inscrireParticipant(evenementId, participant);
        return ResponseEntity.ok(p);
    }


    @DeleteMapping("/participation/{id}")
    public ResponseEntity<String> annulerParticipation(@PathVariable Long id) {
        evenementService.annulerParticipation(id);
        return ResponseEntity.ok("Participation annulée et remboursée.");
    }

    @PostMapping("/{id}/verifier-seuil")
    public ResponseEntity<String> verifierSeuil(@PathVariable Long id) {
        evenementService.verifierSeuilEtAnnulerEvenement(id);
        return ResponseEntity.ok("Vérification terminée.");
    }

    @GetMapping("/{evenementId}/participants")
    public List<Participant> getParticipantsByEvenementId(@PathVariable Long evenementId) {
        return evenementService.getParticipantsByEvenementId(evenementId);
    }

    @PostMapping("/{id}/adjust")
    public ResponseEntity<String> adjustEvent(@PathVariable Long id) {
        try {
            String result = evenementService.adjustEvent(id);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur lors de l'ajustement : " + e.getMessage());
        }
    }

    // Endpoint pour récupérer la météo d’un événement
    @GetMapping("/{id}/weather")
    public ResponseEntity<WeatherInfo> getWeatherForEvent(@PathVariable Long id) {
        try {
            WeatherInfo weatherInfo = evenementService.getWeatherForEvent(id);
            return ResponseEntity.ok(weatherInfo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }


    private ParticipationDTO convertToDTO(Participation participation) {
        ParticipationDTO dto = new ParticipationDTO();
        dto.setId(participation.getId());
        dto.setEvenement(participation.getEvenement());
        dto.setEngagement(participation.getEngagement());
        dto.setStatut(participation.getStatut());
        dto.setDateInscription(participation.getDateInscription());
        dto.setPresence(participation.isPresence());
        dto.setPrixPaye(participation.getPrixPaye().doubleValue());
        dto.setEvaluationNote(participation.getEvaluationNote());
        dto.setCommentaire(participation.getCommentaire());
        return dto;
    }

  /*  @PostMapping("/{id}/ajuster-salle")
    public ResponseEntity<Salle> ajusterSalle(@PathVariable Long id) {
        Salle nouvelleSalle = evenementService.ajusterSalleSelonMeteo(id);
        return nouvelleSalle != null ? ResponseEntity.ok(nouvelleSalle) : ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}/meteo")
    public ResponseEntity<Double> getMeteo(@PathVariable Long id) {
        Double temp = evenementService.getMeteoActuelle(id);
        return temp != null ? ResponseEntity.ok(temp) : ResponseEntity.notFound().build();
    }*/



    @GetMapping("/with-coordinates")
    public ResponseEntity<List<Evenement>> getEventsWithCoordinates() {
        return ResponseEntity.ok(evenementService.getEventsWithCoordinates());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Evenement> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(evenementService.getEventDetails(id));
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<Evenement>> getNearbyEvents(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "10") double radius) {
        return ResponseEntity.ok(
                evenementService.getNearbyEvents(lat, lng, radius));
    }

    @PutMapping("/{id}/coordinates")
    public ResponseEntity<Evenement> updateCoordinates(
            @PathVariable Long id,
            @RequestParam double lat,
            @RequestParam double lng) {
        return ResponseEntity.ok(
                evenementService.updateEventCoordinates(id, lat, lng));
    }
}

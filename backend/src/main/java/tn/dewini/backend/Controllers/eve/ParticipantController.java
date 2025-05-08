package tn.dewini.backend.Controllers.eve;
import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.dewini.backend.Entities.eve.BadgeService;
import tn.dewini.backend.Entities.eve.ParticipantDTO;
import tn.dewini.backend.Entities.eve.ParticipantFilterDTO;
import tn.dewini.backend.Repositories.eve.EvenementRepository;
import tn.dewini.backend.Services.eve.ParticipantService;

import tn.dewini.backend.Entities.eve.Participant;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;

@CrossOrigin(origins = "http://localhost:4200")
@Tag(name = "Gestion EventEngagement", description = "API pour la gestion des engagements d'événements")
@RestController
@RequestMapping("/event-engagement")
public class ParticipantController {

    @Autowired
    private ParticipantService eventEngagementService;
    @Autowired
    EvenementRepository evenementRepository;
    @Autowired
    private BadgeService badgeService;



    @GetMapping("/{eventId}/badge")
    public ResponseEntity<String> getEventBadge(@PathVariable Long eventId) {
        try {
            String badgeData = badgeService.generateBadgeForEvent(eventId);
            return ResponseEntity.ok(badgeData);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Événement non trouvé");
        }
    }
    @Operation(summary = "Récupérer tous les engagements d'événements", description = "Cette méthode permet de récupérer la liste de tous les engagements d'événements.")
    @GetMapping("/retrieve-all-engagements")
    public List<Participant> getAllEngagements() {
        return eventEngagementService.retrieveAllEngagements();
    }

    @Operation(summary = "Récupérer un engagement d'événement par ID", description = "Cette méthode permet de récupérer un engagement d'événement spécifique en fournissant son ID.")
    @GetMapping("/retrieve-engagement/{id}")
    public Participant getEngagementById(@PathVariable Long id) {
        return eventEngagementService.retrieveEngagementById(id);
    }

    @Operation(summary = "Ajouter un nouvel engagement d'événement", description = "Cette méthode permet d'ajouter un nouvel engagement d'événement.")


    @PostMapping("/add-engagement")
    public ResponseEntity<?> addEngagement(@RequestBody Participant participant) {
        try {
            Participant savedParticipant = eventEngagementService.create(participant);
            return new ResponseEntity<>(savedParticipant, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("Erreur lors de la création du participant: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Erreur inattendue lors de la création du participant: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
   /* @PostMapping("/add-engagement")
    public Participant addEngagement(@RequestBody Participant engagement) {
        return eventEngagementService.addEngagement(engagement);
    }*/
    @GetMapping
    public ResponseEntity<Page<Participant>> getAll(ParticipantFilterDTO filter) {
        return ResponseEntity.ok(eventEngagementService.findAll(filter));
    }

    /*@PostMapping("/get")
    public ResponseEntity<Participant> create(@RequestBody ParticipantDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(eventEngagementService.create(dto));
    }*/
    @Operation(summary = "Modifier un engagement d'événement", description = "Cette méthode permet de modifier un engagement d'événement existant.")
    @PutMapping("/modify-engagement")
    public Participant modifyEngagement(@RequestBody Participant engagement) {
        return eventEngagementService.modifyEngagement(engagement);
    }

    @Operation(summary = "Supprimer un engagement d'événement", description = "Cette méthode permet de supprimer un engagement d'événement en fournissant son ID.")
    @DeleteMapping("/remove-engagement/{id}")
    public void removeEngagement(@PathVariable Long id) {
        eventEngagementService.removeEngagement(id);
    }
    @PatchMapping("/{id}")
    public ResponseEntity<ParticipantDTO> updateParticipant(
            @PathVariable Long id,
            @RequestBody ParticipantDTO participantDTO) {
        ParticipantDTO updatedParticipant = eventEngagementService.updateParticipant(id, participantDTO);
        return ResponseEntity.ok(updatedParticipant);
    }
}

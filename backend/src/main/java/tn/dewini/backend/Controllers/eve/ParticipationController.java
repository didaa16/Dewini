package tn.dewini.backend.Controllers.eve;
import java.util.List;
import java.util.Map;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.dewini.backend.Entities.eve.InscriptionRequest;
import tn.dewini.backend.Entities.eve.Participation;
import lombok.AllArgsConstructor;
import tn.dewini.backend.Services.eve.ParticipationService;




@CrossOrigin(origins = "http://localhost:4200")
@Tag(name = "Gestion Participation", description = "API pour la gestion des participations")
@RestController
@AllArgsConstructor
@RequestMapping("/participation")
public class ParticipationController {

    @Autowired
    private ParticipationService participationService;

    @Operation(summary = "Récupérer toutes les participations", description = "Cette méthode permet de récupérer la liste de toutes les participations.")
    @GetMapping("/retrieve-all-participations")
    public List<Participation> getAllParticipations() {
        return participationService.retrieveAllParticipations();
    }

    @Operation(summary = "Récupérer une participation par ID", description = "Cette méthode permet de récupérer une participation spécifique en fournissant son ID.")
    @GetMapping("/retrieve-participation/{id}")
    public Participation getParticipationById(@PathVariable Long id) {
        return participationService.retrieveParticipationById(id);
    }

    @Operation(summary = "Ajouter une nouvelle participation", description = "Cette méthode permet d'ajouter une nouvelle participation.")
    @PostMapping("/add-participation")
    public Participation addParticipation(@RequestBody Participation participation) {
        return participationService.addParticipation(participation);
    }

    @Operation(summary = "Modifier une participation", description = "Cette méthode permet de modifier une participation existante.")
    @PutMapping("/modify-participation")
    public Participation modifyParticipation(@RequestBody Participation participation) {
        return participationService.modifyParticipation(participation);
    }

    @Operation(summary = "Supprimer une participation", description = "Cette méthode permet de supprimer une participation en fournissant son ID.")
    @DeleteMapping("/remove-participation/{id}")
    public void removeParticipation(@PathVariable Long id) {
        participationService.removeParticipation(id);
    }
    @GetMapping("/stats")
    public Map<String, Object> getParticipationStats() {
        return participationService.getParticipationStats();
    }

    @PostMapping("/participations/inscrire")
    public ResponseEntity<Participation> inscrire(@RequestBody InscriptionRequest request) {
        Participation participation = participationService.inscrireParticipant(request);
        return ResponseEntity.ok(participation);
    }
    @GetMapping("/evenement/{evenementId}")
    public List<Participation> getParticipationsByEvenement(@PathVariable Long evenementId) {
        return participationService.getParticipationsByEvenementId(evenementId);
    }

}


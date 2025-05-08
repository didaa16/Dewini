package tn.dewini.backend.Controllers.Rdv;

import tn.dewini.backend.Entities.Rdv.Reponse;
import tn.dewini.backend.Services.Rdv.IReponseService;
import tn.dewini.backend.Services.Rdv.SmsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reponses")
@CrossOrigin(origins = "http://localhost:4200")
public class ReponseRestController {

    @Autowired
    private IReponseService reponseService;
    @Autowired
    private SmsService smsService;

    // Récupérer toutes les réponses
    @GetMapping
    public ResponseEntity<List<Reponse>> getAllReponses() {
        List<Reponse> reponseList = reponseService.retrieveAllReponse();
        return new ResponseEntity<>(reponseList, HttpStatus.OK);
    }

    // Récupérer une réponse par son ID
    @GetMapping("/{id}")
    public ResponseEntity<Reponse> getReponseById(@PathVariable Long id) {
        Reponse reponse = reponseService.retrieveReponse(id);
        if (reponse != null) {
            return new ResponseEntity<>(reponse, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Ajouter une nouvelle réponse
    @PostMapping
    public ResponseEntity<Reponse> createReponse(@RequestBody Reponse reponse) {
        Reponse createdReponse = reponseService.addReponse(reponse);
        return new ResponseEntity<>(createdReponse, HttpStatus.CREATED);
    }

    // Modifier une réponse existante
    @PutMapping("/{id}")
    public ResponseEntity<Reponse> updateReponse(@PathVariable Long id, @RequestBody Reponse reponse) {
        reponse.setIdReponse(id); // Assure que l'ID soit bien pris en compte
        Reponse updatedReponse = reponseService.modifyReponse(reponse);
        if (updatedReponse != null) {
            return new ResponseEntity<>(updatedReponse, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Supprimer une réponse
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReponse(@PathVariable Long id) {
        reponseService.removeReponse(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 No Content
    }
    @GetMapping("/exists/{rendezvousId}")
    public ResponseEntity<Boolean> checkIfResponseExists(@PathVariable Long rendezvousId) {
        boolean exists = reponseService.existsByRendezvousId(rendezvousId);
        return new ResponseEntity<>(exists, HttpStatus.OK);
    }

    // Mettre à jour l'état d'une réponse
    @PutMapping("/{id}/etat")
    public ResponseEntity<Reponse> updateEtatReponse(
            @PathVariable Long id,
            @RequestParam("etat") Reponse.EtatTraitement etat) {
        Reponse updated = reponseService.updateEtatReponse(id, etat);
        if (updated != null) {
            return new ResponseEntity<>(updated, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Compter les réponses par état (pour les stats)
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> countReponsesByEtat() {
        long traite = reponseService.countByEtat(Reponse.EtatTraitement.TRAITE);
        long nonTraite = reponseService.countByEtat(Reponse.EtatTraitement.NON_TRAITE);

        Map<String, Long> counts = new HashMap<>();
        counts.put("traite", traite);
        counts.put("nonTraite", nonTraite);

        return new ResponseEntity<>(counts, HttpStatus.OK);
    }
    @GetMapping("/stats/rendezvous")
    public ResponseEntity<Map<String, Object>> getRendezVousStats() {
        Map<String, Long> etatStats = reponseService.getRendezVousStats();
        Map<String, Long> countStats = reponseService.getRendezVousCountStats();

        Map<String, Object> response = new HashMap<>();
        response.put("parEtat", etatStats);       // Statistiques par état (TRAITE/NON_TRAITE)
        response.put("parPresenceReponse", countStats); // Statistiques par présence de réponse

        return ResponseEntity.ok(response);
    }
    @PostMapping("/with-sms")

    public ResponseEntity<Reponse> createsms(@RequestBody Reponse reponse) {
        // 1. Sauvegarde via l'interface
        Reponse savedReponse = reponseService.saveReponse(reponse);

        // 2. Envoi SMS (test uniquement sur votre numéro)
        String message = "RDV " + reponse.getStatut()
                + " | Patient: " + reponse.getRendezvous().getNomPatient();
        smsService.sendSms(message);

        return ResponseEntity.ok(savedReponse);
    }


}

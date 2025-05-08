package tn.dewini.backend.Controllers.Rdv;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import tn.dewini.backend.Entities.Rdv.Rendezvous;
import tn.dewini.backend.Repositories.Rdv.RendezvousRepository;
import tn.dewini.backend.Services.Rdv.IRendezvousService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
@AllArgsConstructor
@RestController
@RequestMapping("/api/rendezvous")
@CrossOrigin(origins = "http://localhost:4200")
public class RendezvousRestController {

    @Autowired
    private IRendezvousService rendezvousService;


    private final RendezvousRepository rendezvousRepository;
    @GetMapping
    public ResponseEntity<List<Rendezvous>> getAllRendezvous() {
        List<Rendezvous> rendezvousList = rendezvousService.retrieveAllRendezvous();
        return rendezvousList.isEmpty()
                ? ResponseEntity.noContent().build()
                : ResponseEntity.ok(rendezvousList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Rendezvous> getRendezvousById(@PathVariable Long id) {
        Rendezvous rendezvous = rendezvousService.retrieveRendezvous(id);
        return rendezvous != null
                ? ResponseEntity.ok(rendezvous)
                : ResponseEntity.notFound().build();
    }

    @PostMapping("/{idUser}")  // Chemin : /api/rendezvous/{idUser}
    public ResponseEntity<?> createRendezvous(@RequestBody Rendezvous rendezvous, @PathVariable Integer idUser) {
        try {
            LocalTime heure = LocalTime.parse(rendezvous.getHeureRendezvous());

            if (!rendezvousService.isHoraireDisponible(rendezvous.getDateRendezvous(), heure)) {
                List<String> suggestions = rendezvousService.getSuggestedTimes(
                        rendezvous.getDateRendezvous(),
                        rendezvous.getHeureRendezvous());

                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of(
                                "message", "Créneau indisponible",
                                "suggestions", suggestions
                        ));
            }

            Rendezvous created = rendezvousService.addRendezvous(rendezvous,idUser);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Erreur lors de la création: " + e.getMessage());
        }
    }

    @PutMapping("/{idRendezvous}")
    @Transactional
    public ResponseEntity<Rendezvous> updateRendezvous(
            @PathVariable Long idRendezvous,
            @RequestBody Rendezvous rendezvous) {

        // 1. Vérifiez que l'ID correspond
        if(!idRendezvous.equals(rendezvous.getIdRendezvous())) {
            return ResponseEntity.badRequest().build();
        }

        // 2. Chargez l'entité existante
        Rendezvous existing = rendezvousRepository.findById(idRendezvous)
                .orElseThrow(() -> new EntityNotFoundException("Rendez-vous non trouvé"));

        // 3. Mettez à jour les champs modifiables
        existing.setNomPatient(rendezvous.getNomPatient());
        existing.setDateNaissance(rendezvous.getDateNaissance());
        existing.setDateRendezvous(rendezvous.getDateRendezvous());
        existing.setHeureRendezvous(rendezvous.getHeureRendezvous());
        existing.setEmailPatient(rendezvous.getEmailPatient());
        existing.setSexePatient(rendezvous.getSexePatient());

        // 4. Sauvegardez
        Rendezvous updated = rendezvousRepository.save(existing);
        System.out.println("Rendez-vous mis à jour: " + updated); // Log de confirmation

        return ResponseEntity.ok(updated);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRendezvous(@PathVariable Long id) {
        rendezvousService.removeRendezvous(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/disponibilite")
    public ResponseEntity<Boolean> checkDisponibilite(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam("heure") @DateTimeFormat(pattern = "HH:mm") LocalTime heure) {

        boolean disponible = rendezvousService.isHoraireDisponible(date, heure);
        return ResponseEntity.ok(disponible);
    }

    @GetMapping("/suggestions")
    public ResponseEntity<List<String>> getSuggestions(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam @DateTimeFormat(pattern = "HH:mm") String heure) {

        List<String> suggestions = rendezvousService.getSuggestedTimes(date, heure);
        return ResponseEntity.ok(suggestions);
    }
    @GetMapping("/debug")
    public ResponseEntity<String> debugEndpoint() {
        try {
            List<Rendezvous> allRdv = rendezvousService.getAllRendezvous();
            if (allRdv.isEmpty()) {
                return ResponseEntity.ok("Aucun rendez-vous trouvé");
            }

            Rendezvous firstRdv = allRdv.get(0);
            return ResponseEntity.ok(
                    "Debug - Premier Rendez-vous:\n" +
                            "ID: " + firstRdv.getIdRendezvous() + "\n" +
                            "Nom: " + firstRdv.getNomPatient() + "\n" +
                            "Email: " + (firstRdv.getEmailPatient().isEmpty() ? "VIDE" : firstRdv.getEmailPatient()) + "\n" +
                            "Date: " + firstRdv.getDateRendezvous() + "\n" +
                            "Base de données: " + firstRdv.toString()
            );
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("Erreur debug: " + e.getMessage());
        }
    }
    @PostMapping("/send-reminders")
    public ResponseEntity<String> triggerReminders() {
        try {
            rendezvousService.sendReminders();
            return ResponseEntity.ok("Les rappels ont été envoyés avec succès");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de l'envoi des rappels: " + e.getMessage());
        }
    }
}
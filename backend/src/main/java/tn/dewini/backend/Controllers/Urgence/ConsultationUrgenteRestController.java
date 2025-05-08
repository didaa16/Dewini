package tn.dewini.backend.Controllers.Urgence;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.dewini.backend.Entities.Urgence.ConsultationUrgente;
import tn.dewini.backend.Services.Urgence.IConsultationUrgenteService;

import java.util.List;
import java.util.Map;


@Tag(name = "Gestion Consultation Urgente")
@RestController
@AllArgsConstructor
@RequestMapping("/consultationUrgente")
public class ConsultationUrgenteRestController {
    @Autowired
    private IConsultationUrgenteService consultationUrgenteService;

    @GetMapping("/retrieve-all-consultationUrgentes")
    public List<ConsultationUrgente> getConsultationUrgente() {
        return consultationUrgenteService.retrieveAllConsultationUrgentes();
    }

    @GetMapping("/retrieve-consultationUrgente/{consultationUrgente-id}")
    public ConsultationUrgente retrieveConsultationUrgente(@PathVariable("consultationUrgente-id") Long consultationUrgenteId) {
        return consultationUrgenteService.retrieveConsultationUrgente(consultationUrgenteId);
    }
    @PostMapping("/add-consultationUrgente")
    public ConsultationUrgente addConsultationUrgente(@RequestBody ConsultationUrgente cu) {
        return consultationUrgenteService.addConsultationUrgente(cu);
    }
    @DeleteMapping("/remove-consultationUrgente/{consultationUrgente-id}")
    public void removeConsultationUrgente(@PathVariable("consultationUrgente-id") Long consultationUrgenteId) {
        consultationUrgenteService.removeConsultationUrgente(consultationUrgenteId);
    }
    @PutMapping("/modify-consultationUrgente/{consultationUrgente-id}")
    public ConsultationUrgente modifyConsultationUrgente(@PathVariable("consultationUrgente-id") Long consultationUrgenteId, @RequestBody ConsultationUrgente consultationUrgente) {
        consultationUrgente.setIdConsultationUrgente(consultationUrgenteId); // Mettre à jour l'ID
        return consultationUrgenteService.modifyConsultationUrgente(consultationUrgente);
    }
    // ConsultationUrgenteController.java
    @PostMapping("/prendre-en-charge/{idUrgence}")
    public ResponseEntity<ConsultationUrgente> prendreEnChargeUrgence(
            @PathVariable Long idUrgence,
            @RequestBody Map<String, String> requestBody) {
        String lienVideo = requestBody.get("lienVideo"); // Extraire le lien vidéo depuis le corps
        ConsultationUrgente consultation = consultationUrgenteService.prendreEnChargeUrgence(idUrgence, lienVideo);
        return ResponseEntity.ok(consultation);
    }
    @PutMapping("/ambulance/{consultationUrgente-id}")
    public ConsultationUrgente ambulance(@PathVariable("consultationUrgente-id") Long consultationUrgenteId) {
        return consultationUrgenteService.ambulance(consultationUrgenteId);
    }

}

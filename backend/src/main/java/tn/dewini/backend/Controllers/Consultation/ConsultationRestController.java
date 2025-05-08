package tn.dewini.backend.Controllers.Consultation;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.dewini.backend.Entities.Consultation.Consultation;
import tn.dewini.backend.Entities.User.User;
import tn.dewini.backend.Repositories.User.UserRepo;
import tn.dewini.backend.Services.Consultation.IConsultationService;

import java.util.List;

@Tag(name = "Gestion Consultation")
@RestController
@RequestMapping("/consultation")
@Data
@AllArgsConstructor

public class ConsultationRestController {
    @Autowired
    private  IConsultationService consultationService;

    private final UserRepo userRepo;
    @GetMapping("/retrieve-all-consultations")
    public List<Consultation> getAllConsultations() {
        return consultationService.getAllConsultations();
    }

    @GetMapping("/retrieve-consultation/{id}")
    public Consultation getConsultation(@PathVariable Integer id) {
        return consultationService.getConsultationById(id);
    }

    @PostMapping("/add-consultation/{Userid}")  // Ajout du path variable dans l'URL
    public Consultation createConsultation(@RequestBody Consultation consultation, @PathVariable Integer Userid) {
        return consultationService.addConsultation(consultation,Userid);
    }


    @PutMapping("/modify-consultation")
    public Consultation updateConsultation(@RequestBody Consultation consultation) {
        // Récupérer la consultation existante
        Consultation existing = consultationService.getConsultationById(consultation.getId_consultation());

        // Mettre à jour les champs modifiables
        existing.setDate(consultation.getDate());
        existing.setHeure(consultation.getHeure());
        existing.setRapport(consultation.getRapport());
        existing.setRecommandations(consultation.getRecommandations());

        // Mettre à jour le patient si fourni
        if (consultation.getPatient() != null) {
            User patient = userRepo.findById(consultation.getPatient().getId())
                    .orElseThrow(() -> new RuntimeException("Patient non trouvé"));
            existing.setPatient(patient);
        }

        // Mettre à jour le dossier médical si fourni
        if (consultation.getDossierMedical() != null) {
            existing.setDossierMedical(consultation.getDossierMedical());
        }

        return consultationService.modifyConsultation(existing);
    }

    @DeleteMapping("/remove-consultation/{id}")
    public void deleteConsultation(@PathVariable Integer id) {
        consultationService.deleteConsultation(id);
    }
}
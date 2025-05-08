package tn.dewini.backend.Controllers.Consultation;

import tn.dewini.backend.Entities.Consultation.EmailRequest;
import tn.dewini.backend.Services.Consultation.EmailServiceConsultation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/email")
@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600) // Pour Angular
public class EmailController {

    @Autowired
    private EmailServiceConsultation emailServiceConsultation;

    @PostMapping("/send")
    public ResponseEntity<String> sendEmail(@RequestBody EmailRequest request) {
        try {
            emailServiceConsultation.sendEmail(request.getTo(), request.getSubject(), request.getContent());
            return ResponseEntity.ok("Email envoyé avec succès");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erreur lors de l'envoi de l'email: " + e.getMessage());
        }
    }
}

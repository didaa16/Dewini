package tn.dewini.backend.Controllers.eve;

import com.stripe.model.Event;
import com.stripe.model.checkout.Session;

import com.stripe.net.Webhook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import tn.dewini.backend.Repositories.eve.ParticipationRepository;
import tn.dewini.backend.Services.eve.InscriptionService;
import tn.dewini.backend.Entities.eve.InscriptionRequest;
import tn.dewini.backend.Entities.eve.InscriptionResponse;
import tn.dewini.backend.Entities.eve.Participation;
import tn.dewini.backend.Entities.eve.StatutParticipation;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/inscriptions")
public class InscriptionController {
    @Autowired
    InscriptionService inscriptionService;
    @Autowired
    ParticipationRepository participationRepo;


    @PostMapping("/inscrire")
    public ResponseEntity<InscriptionResponse> inscrire(@RequestBody InscriptionRequest request) {
        InscriptionResponse response = inscriptionService.processInscription(request);
        return ResponseEntity.ok(response);
    }
    @PostMapping("/api/stripe/webhook")
    public ResponseEntity<String> handleStripeWebhook(@RequestBody String payload, @RequestHeader("Stripe-Signature") String sigHeader) {
        String endpointSecret = "whsec_..."; // à configurer dans Stripe
        Event event;

        try {
            event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Erreur de vérification");
        }

        if ("checkout.session.completed".equals(event.getType())) {
            Session session = (Session) event.getDataObjectDeserializer().getObject().get();
            Long participantId = Long.parseLong(session.getMetadata().get("participation_id"));


            Participation participation = participationRepo.findByEngagementId(participantId);
            participation.setStatut(StatutParticipation.CONFIRME);
            participationRepo.save(participation);
        }

        return ResponseEntity.ok("OK");
    }

}

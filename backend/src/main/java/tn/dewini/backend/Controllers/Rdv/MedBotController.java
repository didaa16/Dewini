package tn.dewini.backend.Controllers.Rdv;
import tn.dewini.backend.Services.Rdv.MedBotService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class MedBotController {
    private final MedBotService medBotService;

    public MedBotController(MedBotService medBotService) {
        this.medBotService = medBotService;
    }

    @PostMapping("/ask")
    public ResponseEntity<?> askMedBot(@RequestBody Map<String, String> payload) {
        String userInput = payload.get("message");

        if (userInput == null || userInput.isEmpty()) {
            return ResponseEntity.badRequest().body("Le message ne peut pas être vide.");
        }

        // Appelle ton Services MedBot
        String response = medBotService.getMedBotResponse(userInput);
        return ResponseEntity.ok(Map.of("response", response));
    }



}

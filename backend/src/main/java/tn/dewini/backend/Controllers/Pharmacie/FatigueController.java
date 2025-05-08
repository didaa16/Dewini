package tn.dewini.backend.Controllers.Pharmacie;

import tn.dewini.backend.Services.Pharmacie.IFatigueService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/fatigue")
@AllArgsConstructor
@CrossOrigin(origins = "*") // 🔥 pour corriger le problème CORS

public class FatigueController {

    private final IFatigueService fatigueService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadTestPdf(@RequestParam("file") MultipartFile file,
                                                @RequestParam("numeroPatient") String numeroPatient) {
        try {
            String lien = fatigueService.uploadPdfEtEnvoyerWhatsApp(file, numeroPatient);
            return ResponseEntity.ok("✅ Rapport envoyé par WhatsApp : " + lien);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("❌ Erreur : " + e.getMessage());
        }
    }

    @PostMapping("/upload-image")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file,
                                              @RequestParam("numeroPatient") String numeroPatient) {
        try {
            String lien = fatigueService.uploadImageEtEnvoyerWhatsApp(file, numeroPatient);
            return ResponseEntity.ok("✅ Image envoyée : " + lien);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("❌ Erreur : " + e.getMessage());
        }
    }

}


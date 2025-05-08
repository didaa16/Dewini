package tn.dewini.backend.Controllers.Pharmacie;

import lombok.AllArgsConstructor;
import tn.dewini.backend.Entities.Pharmacie.Livraison;
import tn.dewini.backend.Entities.Pharmacie.Ordonnance;
import tn.dewini.backend.Repositories.User.UserRepo;
import tn.dewini.backend.Services.Pharmacie.LivraisonServiceImpl;
import tn.dewini.backend.Services.Pharmacie.IOrdonnanceService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
@CrossOrigin(origins = "*") // ou spécifie ton origine : "http://localhost:4200"
@RestController
@RequestMapping("/api/ordonnances")
public class OrdonnanceController {
    @Autowired
    private IOrdonnanceService ordonnanceService;
    @Operation(summary = "Récupérer toutes les ordonnances")
    @GetMapping
    public List<Ordonnance> getAll() {
        return ordonnanceService.getAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Récupérer une ordonnance par son ID")
    public ResponseEntity<Ordonnance> getById(@PathVariable Long id) {
        Ordonnance ord = ordonnanceService.getById(id);
        return (ord != null) ? ResponseEntity.ok(ord) : ResponseEntity.notFound().build();
    }
    @PostMapping("/{idUser}")
    @Operation(summary = "Créer une nouvelle ordonnance avec prescriptions")
    public Ordonnance create(@RequestBody Ordonnance ordonnance, @PathVariable Integer idUser) {
        return ordonnanceService.save(ordonnance, idUser);
    }




    @Operation(summary = "Supprimer une ordonnance par son ID")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        ordonnanceService.delete(id);
    }

    @Autowired
    private LivraisonServiceImpl livraisonServiceImpl;


    @Operation(summary = "Créer une commande pharmacie à partir d'une ordonnance")
    @PostMapping("/{id}/commander")
    public ResponseEntity<Livraison> commanderDepuisOrdonnance(
            @PathVariable Long id,
            @RequestParam String nomClient,
            @RequestParam String adresse,
            @RequestParam(required = false) String nomMedicament // facultatif
    ) {
        Livraison livraison = livraisonServiceImpl.createCommandeFromOrdonnance(id, nomClient, adresse, nomMedicament);
        return ResponseEntity.ok(livraison);
    }


    @PutMapping("/{id}")
    @Operation(summary = "Mettre à jour une ordonnance")

    public ResponseEntity<Ordonnance> update(@PathVariable Long id, @RequestBody Ordonnance ordonnance) {
        return ResponseEntity.ok(ordonnanceService.update(id, ordonnance));
    }

    @PostMapping("/upload-pdf")
    public ResponseEntity<String> uploadPdf(@RequestParam("file") MultipartFile file,
                                            @RequestParam("ordonnanceId") Long ordonnanceId) {
        try {
            String url = ordonnanceService.uploadPdfFromAngular(file, ordonnanceId);
            System.out.println("✅ PDF envoyé vers Cloudinary. URL : " + url);

            return ResponseEntity.ok(url);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur Cloudinary : " + e.getMessage());
        }


    }

    @PatchMapping("/{id}/commentaire")
    public Ordonnance ajouterCommentaire(@PathVariable Long id, @RequestBody String commentaire) {
        return ordonnanceService.ajouterCommentaire(id, commentaire);
    }


}
package tn.dewini.backend.Controllers.Don;

import tn.dewini.backend.Entities.Don.CentreDeDon;
import tn.dewini.backend.Entities.Don.Don;
import tn.dewini.backend.Entities.Don.State;
import tn.dewini.backend.Entities.User.User;
import tn.dewini.backend.Repositories.User.UserRepo;
import tn.dewini.backend.Services.Don.ICentreDeDon;
import tn.dewini.backend.Services.Don.IDonService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Tag(name = "Gestion Don")
@RestController
@RequestMapping("/dons")
public class DonRestController {

    @Autowired
    private final IDonService donService;
    @Autowired
    private final ICentreDeDon centreDeDonService;
    private final UserRepo utilisateurRepository;
    // Constructor injection (recommended over field injection)
    public DonRestController(IDonService donService, ICentreDeDon centreDeDonService, UserRepo utilisateurRepository) {
        this.donService = donService;
        this.centreDeDonService= centreDeDonService;
        this.utilisateurRepository = utilisateurRepository;
    }

    @GetMapping("/retrieve-all-dons")
    @Operation(summary = "Récupérer tous les dons")
    public ResponseEntity<List<Don>> getAllDons() {
        return ResponseEntity.ok(donService.retrieveAllDons());
    }

    @GetMapping("/retrieve-don/{id}")
    @Operation(summary = "Récupérer un don par ID")
    public ResponseEntity<Don> getDonById(@PathVariable Long id) {
        return ResponseEntity.ok(donService.retrieveDon(id));
    }

    @PostMapping("/add-don")
    @Operation(summary = "Ajouter un nouveau don")
    public ResponseEntity<Don> createDon(@RequestBody Don don) {
        return ResponseEntity.ok(donService.addDon(don));
    }
    @PutMapping("/modify-don/{id}")
    @Operation(summary = "Modifier un don existant")
    public ResponseEntity<Don> updateDon(@PathVariable Long id, @RequestBody Don donDetails) {
        Don existingDon = donService.retrieveDon(id);
        if(donDetails.getTypeDon() != null) {
            existingDon.setTypeDon(donDetails.getTypeDon());
        }
        if(donDetails.getGrpSanguin() != null) {
            existingDon.setGrpSanguin(donDetails.getGrpSanguin());
        }
        if(donDetails.getDateDon() != null) {
            existingDon.setDateDon(donDetails.getDateDon());
        }
        if(donDetails.getCentre() != null) {
            existingDon.setCentre(donDetails.getCentre());
        }
        if(donDetails.getQuantite() != null) {
            existingDon.setQuantite(donDetails.getQuantite());
        }
        return ResponseEntity.ok(donService.modifyDon(existingDon));
    }

    @DeleteMapping("/remove-don/{id}")
    @Operation(summary = "Supprimer un don")
    public ResponseEntity<Void> deleteDon(@PathVariable Long id) {
        donService.removeDon(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{donId}/donneurs/{utilisateurId}")
    @Operation(summary = "Ajouter un donneur à un don")
    public ResponseEntity<Don> addDonneurToDon(
            @PathVariable Long donId,
            @PathVariable Integer utilisateurId) {
        return ResponseEntity.ok(donService.addDonneurToDon(donId, utilisateurId));
    }

    @PutMapping("absence/{donId}/donneurs/{utilisateurId}")
    public ResponseEntity<Don> updateDonneurState(
            @PathVariable Long donId,
            @PathVariable Integer utilisateurId,
            @RequestParam State state) {
        Don updatedDon = donService.updateDonneurState(donId, utilisateurId, state);
        return ResponseEntity.ok(updatedDon);
    }

    @GetMapping("/dons-voisins/{id}")
    public ResponseEntity<List<Don>> getDonsPourUtilisateur(@PathVariable Integer id) {
        return ResponseEntity.ok(donService.getDonsPourUtilisateurProche(id));
    }

    @GetMapping("/verifier-capacite/{centreId}")
    public ResponseEntity<Boolean> verifierCapaciteCentre(@PathVariable int centreId) {
        return ResponseEntity.ok(donService.verifierCapaciteCentre(centreId));
    }

    @GetMapping("/centres-satures")
    public ResponseEntity<List<CentreDeDon>> getCentresSatures() {
        List<CentreDeDon> centres = centreDeDonService.retrieveAllCentresDeDon().stream()
                .filter(c -> !c.peutAccepterPlusDeDons())
                .collect(Collectors.toList());
        return ResponseEntity.ok(centres);
    }

    @GetMapping("/qr-data/{donId}/{userId}")
    public ResponseEntity<Map<String, String>> getQrData(
            @PathVariable Long donId,
            @PathVariable Integer userId) {

        Don don = donService.retrieveDon(donId);

        User utilisateur = utilisateurRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Map<String, String> response = new HashMap<>();
        response.put("donId", don.getIdDon().toString());
        response.put("userId", utilisateur.getId().toString());
        response.put("typeDon", don.getTypeDon().name());
        response.put("dateDon", new SimpleDateFormat("yyyy-MM-dd HH:mm").format(don.getDateDon()));
        response.put("centreNom", don.getCentre().getNom());
        response.put("centreAdresse", don.getCentre().getAdresse());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/predictions")
    public ResponseEntity<Map<String, Object>> getPredictions(
            @RequestParam String typeDon,
            @RequestParam String grpSanguin,
            @RequestParam(defaultValue = "30") int daysAhead) {

        return ResponseEntity.ok(donService.getDonPredictions(typeDon, grpSanguin, daysAhead));
    }

}
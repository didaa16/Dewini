package tn.dewini.backend.Controllers.Don;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.security.PermitAll;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.dewini.backend.Entities.Don.CentreDeDon;
import tn.dewini.backend.Services.Don.ICentreDeDon;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Tag(name = "Gestion Centre De Don")
@RestController
@CrossOrigin
@AllArgsConstructor
@RequestMapping("/centre-de-don")
public class CentreDeDonController {

    @Autowired
    ICentreDeDon centreDeDonService;

    // http://localhost:8089/pi/centre-de-don/retrieve-all-centres
    @GetMapping("/retrieve-all-centres")
    @Operation(description = "Récupérer tous les centres de dons")
    public List<CentreDeDon> getCentresDeDon() {
        return centreDeDonService.retrieveAllCentresDeDon();
    }

    // http://localhost:8089/pi/centre-de-don/retrieve-centre/{centre-id}
    @GetMapping("/retrieve-centre/{centre-id}")
    @Operation(description = "Récupérer un centre de don par ID")
    public CentreDeDon retrieveCentreDeDon(@PathVariable("centre-id") int centreDeDonId) {
        return centreDeDonService.retrieveCentreDeDon(centreDeDonId);
    }

    // http://localhost:8089/pi/centre-de-don/add-centre
    @PostMapping("/add-centre")
    @Operation(description = "Ajouter un centre de don")
    public CentreDeDon addCentreDeDon(@RequestBody CentreDeDon centreDeDon) {
        return centreDeDonService.addCentreDeDon(centreDeDon);
    }

    // http://localhost:8089/pi/centre-de-don/remove-centre/{centre-id}
    @DeleteMapping("/remove-centre/{centre-id}")
    @Operation(description = "Supprimer un centre de don")
    public void removeCentreDeDon(@PathVariable("centre-id") int centreDeDonId) {
        centreDeDonService.removeCentreDeDon(centreDeDonId);
    }

    // http://localhost:8089/pi/centre-de-don/modify-centre
    @PutMapping("/modify-centre")
    @Operation(description = "Modifier un centre de don")
    public CentreDeDon modifyCentreDeDon(@RequestBody CentreDeDon centreDeDon) {
        return centreDeDonService.modifyCentreDeDon(centreDeDon);
    }

    @GetMapping("/statut-capacite/{id}")
    public ResponseEntity<Map<String, Object>> getStatutCapacite(@PathVariable int id) {
        CentreDeDon centre = centreDeDonService.retrieveCentreDeDon(id);
        Map<String, Object> response = new HashMap<>();
        response.put("capaciteActuelle", centre.getCapaciteActuelle());
        response.put("capaciteMaximale", centre.getCapaciteMaximale());
        response.put("statut", centre.getStatusCentre());
        response.put("disponible", centre.peutAccepterPlusDeDons());
        return ResponseEntity.ok(response);
    }
}

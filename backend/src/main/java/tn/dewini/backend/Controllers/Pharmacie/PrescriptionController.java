package tn.dewini.backend.Controllers.Pharmacie;

import tn.dewini.backend.Entities.Pharmacie.Prescription;
import tn.dewini.backend.Services.Pharmacie.IPrescriptionService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    @Autowired
    private IPrescriptionService prescriptionService;

    @GetMapping
    @Operation(summary = "Lister toutes les prescriptions")
    public List<Prescription> getAll() {
        return prescriptionService.getAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Afficher une prescription par son ID")
    public ResponseEntity<Prescription> getById(@PathVariable Long id) {
        Prescription p = prescriptionService.getById(id);
        return (p != null) ? ResponseEntity.ok(p) : ResponseEntity.notFound().build();
    }

    @GetMapping("/ordonnance/{ordonnanceId}")
    @Operation(summary = "Lister les prescriptions d'une ordonnance spécifique")
    public List<Prescription> getByOrdonnance(@PathVariable Long ordonnanceId) {
        return prescriptionService.getByOrdonnanceId(ordonnanceId);
    }

    @PostMapping
    @Operation(summary = "Créer une nouvelle prescription et la lier à une ordonnance")
    public Prescription create(@RequestBody Prescription prescription) {
        return prescriptionService.save(prescription);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer une prescription par son ID")
    public void delete(@PathVariable Long id) {
        prescriptionService.delete(id);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Mettre à jour une prescription existante")
    public ResponseEntity<Prescription> update(@PathVariable Long id, @RequestBody Prescription prescription) {
        return ResponseEntity.ok(prescriptionService.update(id, prescription));
    }

}


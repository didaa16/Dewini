package tn.dewini.backend.Controllers.Consultation;

import tn.dewini.backend.Services.Consultation.GroqService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.dewini.backend.Entities.Consultation.DossierMedicale;
import tn.dewini.backend.Services.Consultation.IDossierMedicaleService;

import java.util.List;

@Tag(name = "Gestion Dossier Médical")
@RestController
@RequestMapping("/dossier")
@Data
@AllArgsConstructor

public class DossierMedicaleRestController {

    @Autowired
    private IDossierMedicaleService dossierMedicaleService;

    @Autowired
    private GroqService groqService;

    @GetMapping("/analyse-dossier/{id}")
    public String analyserDossier(@PathVariable Integer id) {
        DossierMedicale dossier = dossierMedicaleService.getDossierById(id);
        return groqService.analyserDossier(dossier);
    }




    @GetMapping("/retrieve-all-dossiers")
    public List<DossierMedicale> getAllDossiers() {
        return dossierMedicaleService.getAllDossiers();
    }

    @GetMapping("/retrieve-dossier/{id}")
    public DossierMedicale getDossier(@PathVariable Integer id) {
        return dossierMedicaleService.getDossierById(id);
    }

    @PostMapping("/add-dossier")
    public DossierMedicale createDossier(@RequestBody DossierMedicale dossier) {
        return dossierMedicaleService.addDossier(dossier);
    }

    @PutMapping("/modify-dossier")
    public DossierMedicale updateDossier(@RequestBody DossierMedicale dossier) {
        return dossierMedicaleService.modifyDossier(dossier);
    }



    @DeleteMapping("/remove-dossier/{id}")
    public void deleteDossier(@PathVariable Integer id) {
        dossierMedicaleService.deleteDossier(id);
    }
}
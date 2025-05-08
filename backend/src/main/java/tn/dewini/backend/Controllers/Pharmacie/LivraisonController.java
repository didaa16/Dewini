package tn.dewini.backend.Controllers.Pharmacie;

import tn.dewini.backend.Entities.Pharmacie.Livraison;
//import com.pi.projet.Entities.LivraisonMedicament;
//import com.pi.projet.Repositories.LivraisonMedicamentRepository;
import tn.dewini.backend.Services.Pharmacie.LivraisonServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/livraisons")
@CrossOrigin(origins = "*")
public class LivraisonController {

    @Autowired
    private LivraisonServiceImpl livraisonService;
    //private LivraisonMedicamentRepository livraisonMedicamentRepository;

    @GetMapping
    public List<Livraison> getAll() {
        return livraisonService.getAllLivraison();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        return ResponseEntity.ok().body(livraisonService.deleteCommandeFromOrdonnance(id));
    }
    @PutMapping("/{id}")
    public ResponseEntity<Livraison> updateLivraison(@PathVariable Long id, @RequestBody Livraison livraison) {
        Livraison updated = livraisonService.updateLivraison(id, livraison);
        return ResponseEntity.ok(updated);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Livraison> getById(@PathVariable Long id) {
        Livraison livraison = livraisonService.getById(id);
        return ResponseEntity.ok(livraison);
    }

    @PostMapping("/commande/panier")
    public Livraison commanderDepuisPanier(@RequestBody Map<String, Object> payload) {
        Integer patientId = (Integer) payload.get("patientId");
        String nomClient = (String) payload.get("nomClient");
        String adresse = (String) payload.get("adresse");
        List<Integer> ids = (List<Integer>) payload.get("medicamentIds");

        List<Long> medicamentIds = ids.stream().map(Long::valueOf).collect(Collectors.toList());

        return livraisonService.createCommandeLibre(patientId, nomClient, adresse, medicamentIds);
    }

    @PostMapping
    public ResponseEntity<Livraison> add(@RequestBody Livraison livraison) {
        Livraison saved = livraisonService.saveLivraison(livraison);
        return ResponseEntity.ok(saved);
    }



    /*@GetMapping("/debug")
    public List<LivraisonMedicament> debug() {
        return livraisonMedicamentRepository.findAll();
    }*/


}


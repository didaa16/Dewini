package tn.dewini.backend.Controllers.Pharmacie;

import tn.dewini.backend.Entities.Pharmacie.Medicament;
import tn.dewini.backend.Services.Pharmacie.IMedicamentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/medicaments")
@CrossOrigin(origins = "*") // Pour accepter les appels externes (Swagger/Angular)
public class MedicamentController {

    @Autowired
    private IMedicamentService medicamentService;

    @GetMapping
    public List<Medicament> getAll() {
        return medicamentService.getAll();
    }

    @GetMapping("/{id}")
    public Medicament getById(@PathVariable Long id) {
        return medicamentService.getById(id);
    }

    @PostMapping()
    public ResponseEntity <Medicament> create(@RequestBody Medicament medicament) {
        medicamentService.create(medicament);
        return ResponseEntity.ok().body(medicament);
    }


    @PutMapping("/{id}")
    public Medicament update(@PathVariable Long id, @RequestBody Medicament medicament) {
        return medicamentService.update(id, medicament);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        String result = medicamentService.deleteMedicament(id);
        if (result.startsWith("✅")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(result); // 409 Conflict
        }
    }


    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Medicament uploadMedicamentWithImage(
            @RequestPart("medicament") Medicament medicament,
            @RequestPart("image") MultipartFile imageFile) throws IOException {

        // 1. Génère un nom de fichier unique
        String fileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();

        // 2. Chemin du dossier "uploads"
        Path imagePath = Paths.get("uploads", fileName);
        Files.createDirectories(imagePath.getParent());
        Files.write(imagePath, imageFile.getBytes());

        // 3. Crée l’URL publique
        String imageUrl = "http://localhost:8081/api/v1/uploads/" + fileName;
        medicament.setImageUrl(imageUrl);

        // 4. Enregistre dans la base
        return medicamentService.create(medicament);
    }
    @GetMapping("/byCategorie/{categorie}")
    public List<Medicament> getByCategorie(@PathVariable String categorie) {
        return medicamentService.findByCategorie(categorie);
    }

    @PutMapping("/ajouter-note/{id}")
    public Medicament ajouterNote(@PathVariable Long id, @RequestParam int note) {
        return medicamentService.ajouterNote(id, note);
    }

    @GetMapping("/{id}/moyenne")
    public ResponseEntity<Double> getMoyenneNotes(@PathVariable Long id) {
        double moyenne = medicamentService.calculerMoyenneNotes(id);
        return ResponseEntity.ok(moyenne);
    }

    @GetMapping("/{id}/notes")
    public ResponseEntity<List<Integer>> getNotes(@PathVariable Long id) {
        Medicament medicament = medicamentService.getById(id);
        return ResponseEntity.ok(medicament.getNotes());
    }





}

package tn.dewini.backend.Services.Pharmacie;

import lombok.AllArgsConstructor;
import tn.dewini.backend.Entities.Pharmacie.Ordonnance;
import tn.dewini.backend.Repositories.Pharmacie.OrdonnanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.web.multipart.MultipartFile;
import tn.dewini.backend.Repositories.User.UserRepo;

import java.util.List;
import java.util.Map;

@AllArgsConstructor
@Service
public class OrdonnanceServiceImpl implements IOrdonnanceService {
      private final UserRepo utilisateurRepository;
    @Autowired
    private OrdonnanceRepository ordonnanceRepository;

    @Override
    public List<Ordonnance> getAll() {
        return ordonnanceRepository.findAll();
    }

    @Override
    public Ordonnance getById(Long id) {
        return ordonnanceRepository.findById(id).orElse(null);
    }

    @Override
    public Ordonnance save(Ordonnance ordonnance,Integer Userid) {
        ordonnance.setMedecinId(utilisateurRepository.findById(Userid).get());
        ordonnance.setPatientId(utilisateurRepository.findById(Userid).get());
        ordonnance.setDateEmission(LocalDate.now());
        ordonnance.setDateAjout(LocalDate.now()); // ✅ Ajout automatique de la date d'ajout

        if (ordonnance.getPrescriptions() != null) {
            ordonnance.getPrescriptions().forEach(p -> p.setOrdonnance(ordonnance));
        }

        return ordonnanceRepository.save(ordonnance);
    }




    @Override
    public void delete(Long id) {
        ordonnanceRepository.deleteById(id);
    }

    @Override
    public Ordonnance update(Long id, Ordonnance updated) {
        Ordonnance existing = ordonnanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ordonnance non trouvée"));

        existing.setInstructions(updated.getInstructions());
        existing.setMedecinId(updated.getMedecinId());
        existing.setPatientId(updated.getPatientId());

        // ✅ Met à jour la signature si elle est présente
        existing.setSignature(updated.getSignature());

        // Supprimer les anciennes prescriptions
        existing.getPrescriptions().clear();

        // Ajouter les nouvelles prescriptions en les reliant à l'ordonnance
        if (updated.getPrescriptions() != null) {
            updated.getPrescriptions().forEach(p -> {
                p.setOrdonnance(existing);
                existing.getPrescriptions().add(p);
            });
        }

        return ordonnanceRepository.save(existing);
    }

    @Autowired
    private Cloudinary cloudinary;

    @Override
    public String uploadPdfFromAngular(MultipartFile file, Long ordonnanceId) {
        if (!file.getContentType().equals("application/pdf")) {
            throw new IllegalArgumentException("Seuls les fichiers PDF sont autorisés.");
        }

        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "resource_type", "raw",
                    "folder", "ordonnances",
                    "use_filename", true,
                    "unique_filename", false,
                    "public_id", "ordonnance_" + ordonnanceId
            ));

            String url = uploadResult.get("secure_url").toString();

            Ordonnance ordonnance = ordonnanceRepository.findById(ordonnanceId)
                    .orElseThrow(() -> new RuntimeException("Ordonnance non trouvée"));
            ordonnance.setLienPdf(url);
            ordonnanceRepository.save(ordonnance);

            return url;

        } catch (Exception e) {
            throw new RuntimeException("Erreur upload Cloudinary : " + e.getMessage(), e);
        }
    }

    @Override
    public Ordonnance ajouterCommentaire(Long id, String commentaire) {
        Ordonnance ordonnance = ordonnanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ordonnance non trouvée"));

        ordonnance.setCommentaire(commentaire); // Assure-toi que le champ existe

        return ordonnanceRepository.save(ordonnance);
    }









}


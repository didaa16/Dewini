package tn.dewini.backend.Services.Pharmacie;

import jakarta.servlet.http.HttpServletResponse;
import tn.dewini.backend.Entities.Pharmacie.Ordonnance;
import org.springframework.web.multipart.MultipartFile;
import tn.dewini.backend.Entities.Urgence.StatutUrgence;
import tn.dewini.backend.Entities.Urgence.TypeUrgence;
import tn.dewini.backend.Entities.Urgence.Urgence;

import java.util.List;
import java.util.Map;

public interface IOrdonnanceService {
    List<Ordonnance> getAll();
    Ordonnance getById(Long id);
    Ordonnance save(Ordonnance ordonnance, Integer idUser);
    void delete(Long id);
    Ordonnance update(Long id, Ordonnance updated);
    public String uploadPdfFromAngular(MultipartFile file, Long ordonnanceId);
    public Ordonnance ajouterCommentaire(Long id, String commentaire);

}

package tn.dewini.backend.Services.Pharmacie;

import tn.dewini.backend.Entities.Pharmacie.Medicament;
import tn.dewini.backend.Repositories.Pharmacie.MedicamentRepository;
import tn.dewini.backend.Repositories.Pharmacie.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicamentServiceImpl implements IMedicamentService {

    @Autowired
    private MedicamentRepository medicamentRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Override
    public List<Medicament> getAll() {
        return medicamentRepository.findAll();
    }

    @Override
    public Medicament getById(Long id) {
        return medicamentRepository.findById(id).orElseThrow();
    }

    @Override
    public Medicament create(Medicament medicament) {
        return medicamentRepository.save(medicament);
    }

    @Override
    public Medicament update(Long id, Medicament medicament) {
        medicament.setId(id);
        return medicamentRepository.save(medicament);
    }

    @Override
    public String deleteMedicament(Long id) {
        Medicament medicament = medicamentRepository.findById(id).orElse(null);

        if (medicament == null) {
            return "Ce médicament n'existe pas.";
        }

        boolean hasOrdonnances = !prescriptionRepository.findByMedicamentId(id).isEmpty();
        boolean hasLivraisons = !medicament.getLivraisons().isEmpty();

        if (hasOrdonnances || hasLivraisons) {
            return "Ce médicament est lié à d'autres données (ordonnances ou livraisons) et ne peut pas être supprimé.";
        }

        medicamentRepository.deleteById(id);
        return "Le médicament a été supprimé avec succès.";
    }

    public List<Medicament> findByCategorie(String categorie) {
        return medicamentRepository.findByCategorie(categorie);
    }
    public double calculerMoyenneNotes(Long medicamentId) {
        Medicament medicament = medicamentRepository.findById(medicamentId)
                .orElseThrow(() -> new RuntimeException("Médicament introuvable"));

        List<Integer> notes = medicament.getNotes();
        if (notes.isEmpty()) {
            return 0;
        }

        double total = 0;
        for (Integer note : notes) {
            total += note;
        }

        return total / notes.size();
    }


    @Override
    public Medicament ajouterNote(Long medicamentId, int note) {
        Medicament medicament = medicamentRepository.findById(medicamentId)
                .orElseThrow(() -> new RuntimeException("Médicament introuvable"));

        // Ajouter la nouvelle note à la liste des notes du médicament
        medicament.getNotes().add(note);

        // Sauvegarder le médicament avec la nouvelle note
        medicamentRepository.save(medicament);

        // Vous pouvez aussi calculer la moyenne ici si nécessaire (voir méthode de calcul ci-dessous)
        return medicament;
    }








}

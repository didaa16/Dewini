package tn.dewini.backend.Services.Pharmacie;

import lombok.AllArgsConstructor;
import tn.dewini.backend.Entities.Pharmacie.Livraison;
import tn.dewini.backend.Entities.Pharmacie.Medicament;
import tn.dewini.backend.Entities.Pharmacie.Ordonnance;
import tn.dewini.backend.Entities.Pharmacie.Prescription;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.dewini.backend.Entities.User.User;
import tn.dewini.backend.Repositories.Pharmacie.LivraisonRepository;
import tn.dewini.backend.Repositories.Pharmacie.MedicamentRepository;
import tn.dewini.backend.Repositories.Pharmacie.OrdonnanceRepository;
import tn.dewini.backend.Repositories.Pharmacie.PrescriptionRepository;
import tn.dewini.backend.Repositories.User.UserRepo;

import java.time.LocalDateTime;
import java.util.List;
@AllArgsConstructor
@Service
public class LivraisonServiceImpl {

    @Autowired
    private OrdonnanceRepository ordonnanceRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private MedicamentRepository medicamentRepository;

    @Autowired
    private LivraisonRepository livraisonRepository;


    private final UserRepo userRepository;
    public Livraison createCommandeFromOrdonnance(Long ordonnanceId, String nomClient, String adresse, String nomMedicament) {
        System.out.println("✅ MÉTHODE COMMANDER APPELÉE POUR ORDONNANCE ID : " + ordonnanceId);

        Ordonnance ordonnance = ordonnanceRepository.findById(ordonnanceId)
                .orElseThrow(() -> new RuntimeException("❌ Ordonnance non trouvée"));

        List<Prescription> prescriptions = prescriptionRepository.findByOrdonnanceId(ordonnanceId);
        System.out.println("🔍 Nombre de prescriptions : " + prescriptions.size());

        Livraison livraison = new Livraison();
        livraison.setNomClient(nomClient);
        livraison.setAdresse(adresse);
        livraison.setDateLivraison(LocalDateTime.now());
        livraison.setEtat("EN_ATTENTE");

        List<Medicament> medicaments = prescriptions.stream()
                .map(Prescription::getMedicament)
                .filter(m -> m.getQuantiteEnStock() > 0)
                .filter(m -> nomMedicament == null || m.getNom().equalsIgnoreCase(nomMedicament)) // filtre facultatif
                .distinct()
                .toList();

        livraison.setMedicaments(medicaments);

        Livraison savedLivraison = livraisonRepository.save(livraison);

        System.out.println("✅ Livraison enregistrée avec " + medicaments.size() + " médicament(s)");
        return savedLivraison;
    }
    public List<Livraison> getAllLivraison() {
        return livraisonRepository.findAll();
    }
    public String deleteCommandeFromOrdonnance(Long id) {
        Livraison livraison = livraisonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livraison non trouvée"));

// Supprimer la liaison avec les médicaments pour éviter le cascade delete
        livraison.getMedicaments().clear();
        livraisonRepository.save(livraison);

// Ensuite supprimer
        livraisonRepository.deleteById(id);

        return "Deleted Sucessfully";
    }
    public Livraison updateLivraison(Long id, Livraison updatedLivraison) {
        Livraison existing = livraisonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livraison non trouvée"));

        existing.setNomClient(updatedLivraison.getNomClient());
        existing.setAdresse(updatedLivraison.getAdresse());
        existing.setEtat(updatedLivraison.getEtat());
        existing.setDateLivraison(updatedLivraison.getDateLivraison());
        existing.setMedicaments(updatedLivraison.getMedicaments()); // facultatif, à adapter

        return livraisonRepository.save(existing);
    }
    public Livraison getById(Long id) {
        return livraisonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livraison non trouvée"));
    }
    public Livraison createCommandeLibre(Integer patientId, String nomClient, String adresse, List<Long> medicamentIds) {
        // Récupérer les médicaments par leurs IDs
        List<Medicament> medicaments = medicamentRepository.findAllById(medicamentIds);

        // Récupérer l'utilisateur (patient) par son ID
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new IllegalArgumentException("Patient with ID " + patientId + " not found"));

        // Créer une nouvelle livraison
        Livraison livraison = new Livraison();
        livraison.setNomClient(nomClient);
        livraison.setAdresse(adresse);
        livraison.setDateLivraison(LocalDateTime.now());
        livraison.setEtat("EN_ATTENTE");
        livraison.setMedicaments(medicaments);
        livraison.setPatientId(patient); // Définir le patient

        // Sauvegarder la livraison dans la base de données
        return livraisonRepository.save(livraison);
    }

    public Livraison saveLivraison(Livraison livraison) {
        return livraisonRepository.save(livraison);
    }


}


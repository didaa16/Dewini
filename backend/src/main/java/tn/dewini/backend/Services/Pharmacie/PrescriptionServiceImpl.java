package tn.dewini.backend.Services.Pharmacie;

import tn.dewini.backend.Entities.Pharmacie.Ordonnance;
import tn.dewini.backend.Entities.Pharmacie.Prescription;
import tn.dewini.backend.Repositories.Pharmacie.OrdonnanceRepository;
import tn.dewini.backend.Repositories.Pharmacie.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PrescriptionServiceImpl implements IPrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;
    @Autowired
    private OrdonnanceRepository ordonnanceRepository;

    @Override
    public List<Prescription> getAll() {
        return prescriptionRepository.findAll();
    }

    @Override
    public Prescription getById(Long id) {
        return prescriptionRepository.findById(id).orElse(null);
    }

    public Prescription save(Prescription prescription) {
        // 🔁 Relier proprement l'ordonnance à partir de l'ID
        if (prescription.getOrdonnance() != null && prescription.getOrdonnance().getId() != null) {
            Ordonnance ord = ordonnanceRepository.findById(prescription.getOrdonnance().getId())
                    .orElseThrow(() -> new RuntimeException("Ordonnance non trouvée"));
            prescription.setOrdonnance(ord);
        } else {
            throw new RuntimeException("Ordonnance manquante ou ID absent");
        }

        return prescriptionRepository.save(prescription);
    }

    @Override
    public void delete(Long id) {
        prescriptionRepository.deleteById(id);
    }

    @Override
    public List<Prescription> getByOrdonnanceId(Long ordonnanceId) {
        return prescriptionRepository.findByOrdonnanceId(ordonnanceId);
    }

    @Override
    public Prescription update(Long id, Prescription updated) {
        Prescription p = prescriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prescription non trouvée"));

        p.setMedicamentNom(updated.getMedicamentNom());
        p.setPosologie(updated.getPosologie());
        p.setDuree(updated.getDuree());

        return prescriptionRepository.save(p);
    }

}


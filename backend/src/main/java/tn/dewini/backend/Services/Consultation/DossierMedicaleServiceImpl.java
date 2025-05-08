package tn.dewini.backend.Services.Consultation;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.dewini.backend.Entities.Consultation.DossierMedicale;
import tn.dewini.backend.Entities.User.User;
import tn.dewini.backend.Repositories.Consultation.DossierMedicaleRepository;
import tn.dewini.backend.Repositories.User.UserRepo;

import java.util.List;
@AllArgsConstructor
@Service
public class DossierMedicaleServiceImpl implements IDossierMedicaleService {

    @Autowired
    private DossierMedicaleRepository dossierMedicaleRepository;


    private final UserRepo utilisateurRepository;

    @Override
    public List<DossierMedicale> getAllDossiers() {
        return dossierMedicaleRepository.findAllWithPatient();
    }

    @Override
    public DossierMedicale getDossierById(Integer id) {
        return dossierMedicaleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dossier médical not found"));
    }

    @Override
    public DossierMedicale addDossier(DossierMedicale dossier) {
        Integer patientId = dossier.getPatient().getId();

        User patient = utilisateurRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        dossier.setPatient(patient);

        return dossierMedicaleRepository.save(dossier);
    }


    @Override
    public DossierMedicale modifyDossier(DossierMedicale dossier) {
        return dossierMedicaleRepository.save(dossier);
    }

    @Override
    public void deleteDossier(Integer id) {
        DossierMedicale dossier = dossierMedicaleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dossier médical not found"));

        User patient = dossier.getPatient();
        if (patient != null) {
            // On casse le lien des 2 côtés
            patient.setDossierMedicale(null);
            dossier.setPatient(null);

            utilisateurRepository.save(patient);
        }

        dossierMedicaleRepository.delete(dossier);
    }
}

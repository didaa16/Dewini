package tn.dewini.backend.Services.Consultation;

import tn.dewini.backend.Entities.Consultation.DossierMedicale;

import java.util.List;

public interface IDossierMedicaleService {
    // Retrieve all dossiers
    List<DossierMedicale> getAllDossiers();

    // Retrieve a dossier by ID
    DossierMedicale getDossierById(Integer id);

    // Add a new dossier
    DossierMedicale addDossier(DossierMedicale dossier);

    // Update an existing dossier
    DossierMedicale modifyDossier(DossierMedicale dossier);

    // Delete a dossier by ID
    void deleteDossier(Integer id);
}
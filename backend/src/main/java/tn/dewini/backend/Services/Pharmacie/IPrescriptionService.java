package tn.dewini.backend.Services.Pharmacie;

import tn.dewini.backend.Entities.Pharmacie.Prescription;

import java.util.List;

public interface IPrescriptionService {
    List<Prescription> getAll();
    Prescription getById(Long id);
    Prescription save(Prescription prescription);
    void delete(Long id);
    List<Prescription> getByOrdonnanceId(Long ordonnanceId);
    Prescription update(Long id, Prescription updated);

}


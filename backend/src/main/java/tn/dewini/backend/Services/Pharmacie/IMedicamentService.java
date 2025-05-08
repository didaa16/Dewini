package tn.dewini.backend.Services.Pharmacie;


import tn.dewini.backend.Entities.Pharmacie.Medicament;

import java.util.List;

public interface IMedicamentService {
    List<Medicament> getAll();
    Medicament getById(Long id);
    Medicament create(Medicament medicament);
    Medicament update(Long id, Medicament medicament);
    public String deleteMedicament(Long id) ;
    public List<Medicament> findByCategorie(String categorie);
    public Medicament ajouterNote(Long id, int note);
    public double calculerMoyenneNotes(Long medicamentId);
}

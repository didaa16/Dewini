package tn.dewini.backend.Repositories.Pharmacie;

import tn.dewini.backend.Entities.Pharmacie.Medicament;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MedicamentRepository extends JpaRepository<Medicament, Long> {
    Optional<Medicament> findByNomIgnoreCase(String nom);
    List<Medicament> findByCategorie(String categorie);

}


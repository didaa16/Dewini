package tn.dewini.backend.Repositories.Pharmacie;

import org.springframework.stereotype.Repository;
import tn.dewini.backend.Entities.Pharmacie.Ordonnance;
import org.springframework.data.jpa.repository.JpaRepository;
@Repository
public interface OrdonnanceRepository extends JpaRepository<Ordonnance, Long> {
}


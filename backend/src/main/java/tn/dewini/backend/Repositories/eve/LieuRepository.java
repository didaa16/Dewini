package tn.dewini.backend.Repositories.eve;

import tn.dewini.backend.Entities.eve.Lieu;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LieuRepository extends JpaRepository<Lieu, Long> {
    Optional<Lieu> findById(Long id);
    List<Lieu> findByEstExterieurTrue();
    List<Lieu> findByEstExterieurFalse();
}

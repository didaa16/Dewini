package tn.dewini.backend.Repositories.Pharmacie;

import tn.dewini.backend.Entities.Pharmacie.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    List<Prescription> findByOrdonnanceId(Long ordonnanceId);
    @Modifying
    @Query("DELETE FROM Prescription p WHERE p.medicament.id = :medicamentId")
    void deleteByMedicamentId(@Param("medicamentId") Long medicamentId);

    List<Prescription> findByMedicamentId(Long medicamentId);

    @Modifying
    @Query("UPDATE Prescription p SET p.medicament = null WHERE p.medicament.id = :id")
    void clearMedicamentReferences(@Param("id") Long id);

    @Modifying
    @Query("UPDATE Prescription p SET p.medicament = null WHERE p.medicament.id = :medicamentId")
    void dissocierMedicament(@Param("medicamentId") Long medicamentId);



}


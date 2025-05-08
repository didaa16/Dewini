package tn.dewini.backend.Repositories.Consultation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import tn.dewini.backend.Entities.Consultation.DossierMedicale;

import java.util.List;

@Repository
public interface DossierMedicaleRepository extends JpaRepository<DossierMedicale, Integer> {
    @Query("SELECT d FROM DossierMedicale d LEFT JOIN FETCH d.patient")
    List<DossierMedicale> findAllWithPatient();
}
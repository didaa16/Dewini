package tn.dewini.backend.Repositories.Consultation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.dewini.backend.Entities.Consultation.Consultation;

@Repository
public interface ConsultationRepository extends JpaRepository<Consultation, Integer> {}
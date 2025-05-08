package tn.dewini.backend.Repositories.Urgence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.dewini.backend.Entities.Urgence.ConsultationUrgente;

@Repository
public interface ConsultationUrgenteRepository extends JpaRepository<ConsultationUrgente, Long> {
    // No need to code CRUD here. It is already provided by the Spring Data JPA interfaces:
    // - CrudRepository
    // - PagingAndSortingRepository
    // - JpaRepository
}

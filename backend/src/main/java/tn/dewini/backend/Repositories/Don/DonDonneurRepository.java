package tn.dewini.backend.Repositories.Don;

import tn.dewini.backend.Entities.Don.DonDonneur;
import tn.dewini.backend.Entities.Don.DonDonneurId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DonDonneurRepository extends JpaRepository<DonDonneur, DonDonneurId> {
}

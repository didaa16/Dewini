package tn.dewini.backend.Services.User;

import tn.dewini.backend.Entities.User.User;
import tn.dewini.backend.Repositories.User.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MedecinService {
    private final UserRepo userRepo;

    public List<User> getAllMedecins() {
        return userRepo.findByRolesName("MEDECIN");
    }

    public User getMedecinById(Integer id) {
        return userRepo.findByIdAndRolesName(id, "MEDECIN")
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
    }

    public List<User> getMedecinsBySpecialite(String specialite) {
        return userRepo.findBySpecialiteAndRolesName(specialite, "MEDECIN");
    }

    public User updateMedecin(Integer id, User updatedMedecin) {
        User existing = getMedecinById(id);

        existing.setSpecialite(updatedMedecin.getSpecialite());
        existing.setAnneesExperience(updatedMedecin.getAnneesExperience());

        return userRepo.save(existing);
    }
}
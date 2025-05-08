package tn.dewini.backend.Services.Don;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.dewini.backend.Entities.Don.CentreDeDon;
import tn.dewini.backend.Repositories.Don.CentreDeDonRepository;

import java.util.List;

@Service
@AllArgsConstructor
public class CentreDeDonServiceImpl implements ICentreDeDon {

    @Autowired
    private CentreDeDonRepository centreDeDonRepository;

    @Override
    public List<CentreDeDon> retrieveAllCentresDeDon() {
        // Récupère tous les centres de dons
        return centreDeDonRepository.findAll();
    }

    @Override
    public CentreDeDon retrieveCentreDeDon(int centreDeDonId) {
        // Récupère un centre de don spécifique par son ID
        return centreDeDonRepository.findById(centreDeDonId).orElse(null);
    }

    @Override
    public CentreDeDon addCentreDeDon(CentreDeDon centreDeDon) {
        // Ajoute un nouveau centre de don
        return centreDeDonRepository.save(centreDeDon);
    }

    @Override
    public void removeCentreDeDon(int centreDeDonId) {
        // Supprime un centre de don par son ID
        centreDeDonRepository.deleteById(centreDeDonId);
    }

    @Override
    public CentreDeDon modifyCentreDeDon(CentreDeDon centreDeDon) {
        // Modifie un centre de don existant
        return centreDeDonRepository.save(centreDeDon);
    }
}

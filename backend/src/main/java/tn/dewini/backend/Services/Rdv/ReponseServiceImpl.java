
package tn.dewini.backend.Services.Rdv;

import tn.dewini.backend.Entities.Rdv.Reponse;
import tn.dewini.backend.Repositories.Rdv.ReponseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.dewini.backend.Services.Pharmacie.WhatsappServiceImpl;
// Ajoutez ces imports en haut du fichier :
//import org.springframework.data.domain.Pageable;
///import org.springframework.data.domain.Pageable;


//import java.awt.print.Pageable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ReponseServiceImpl implements IReponseService {

    @Autowired
    private ReponseRepository reponseRepository;
    @Autowired
    private WhatsappServiceImpl smsService;

    @Override
    public List<Reponse> retrieveAllReponse() {
        return reponseRepository.findAll(); // Récupère toutes les réponses
    }

    @Override
    public Reponse retrieveReponse(Long idReponse) {
        Optional<Reponse> reponse = reponseRepository.findById(idReponse);
        return reponse.orElse(null); // Retourne la réponse ou null si elle n'existe pas
    }

    @Override
    public Reponse addReponse(Reponse reponse) {
        // Marquer automatiquement comme TRAITE quand on crée une réponse
        reponse.setEtat(Reponse.EtatTraitement.TRAITE);
        return reponseRepository.save(reponse);
    }

    @Override
    public void removeReponse(Long idReponse) {
        reponseRepository.deleteById(idReponse); // Supprime la réponse par son ID
    }

    @Override
    public Reponse modifyReponse(Reponse reponse) {
        // Vérifie si la réponse existe avant de la modifier
        if (reponseRepository.existsById(reponse.getIdReponse())) {
            return reponseRepository.save(reponse); // Met à jour la réponse
        }
        return null; // Si la réponse n'existe pas, retourne null
    }
    @Override
    public boolean existsByRendezvousId(Long rendezvousId) {
        return reponseRepository.existsByRendezvousIdRendezvous(rendezvousId);
    }

    @Override
    public Reponse updateEtatReponse(Long idReponse, Reponse.EtatTraitement etat) {
        Optional<Reponse> optionalReponse = reponseRepository.findById(idReponse);
        if (optionalReponse.isPresent()) {
            Reponse reponse = optionalReponse.get();
            reponse.setEtat(etat);
            return reponseRepository.save(reponse);
        }
        return null;
    }

    @Override
    public long countByEtat(Reponse.EtatTraitement etat) {
        return reponseRepository.countByEtat(etat);
    }

    @Override
    public Map<String, Long> getRendezVousStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("traites", reponseRepository.countByEtat(Reponse.EtatTraitement.TRAITE));
        stats.put("nonTraites", reponseRepository.countByEtat(Reponse.EtatTraitement.NON_TRAITE));
        return stats;
    }

    @Override
    public Map<String, Long> getRendezVousCountStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("avecReponse", reponseRepository.countRendezVousWithReponse());
        stats.put("sansReponse", reponseRepository.countRendezVousWithoutReponse());
        return stats;
    }


    @Override
    public Reponse saveReponse(Reponse reponse) {
        return reponseRepository.save(reponse);
    }
}

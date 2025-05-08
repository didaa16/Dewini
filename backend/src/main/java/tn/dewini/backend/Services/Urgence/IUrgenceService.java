package tn.dewini.backend.Services.Urgence;

import jakarta.servlet.http.HttpServletResponse;
import tn.dewini.backend.Entities.Urgence.StatutUrgence;
import tn.dewini.backend.Entities.Urgence.TypeUrgence;
import tn.dewini.backend.Entities.Urgence.Urgence;
import tn.dewini.backend.Entities.User.User;

import java.util.List;
import java.util.Map;

public interface IUrgenceService {
    List<Urgence> retrieveAllUrgences();
    Urgence retrieveUrgence(Long idUrgence);
    Urgence addUrgence(Urgence u);
    void removeUrgence(Long idUrgence);
    Urgence modifyUrgence(Urgence urgence, Long idUrgence);
    void generateExcel(HttpServletResponse response) throws Exception ;
    Urgence desaffecterUtilisateurFromUrgence(Long idUrgence);
    List<Urgence> retrieveAllUrgencesSortedByPriority();
    List<Urgence> retrieveAllUrgencesWithoutTreated();
    List <Urgence> retrieveUrgenceByUser(Integer userId);
    //STATS
    Long getTreatedUrgencesCount(String period);
    Map<TypeUrgence, Long> getUrgenceTypeDistribution();
    Map<StatutUrgence, Long> getUrgenceStatutRatio();

    //PREDICT SPECIALITE

    //CARTE THERMIQUE
    List<Urgence> findByTypeUrgence(TypeUrgence typeUrgence);

}
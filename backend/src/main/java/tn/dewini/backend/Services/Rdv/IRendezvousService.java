package tn.dewini.backend.Services.Rdv;

import jakarta.servlet.http.HttpServletResponse;
import tn.dewini.backend.Entities.Rdv.Rendezvous;
import tn.dewini.backend.Entities.Urgence.StatutUrgence;
import tn.dewini.backend.Entities.Urgence.TypeUrgence;
import tn.dewini.backend.Entities.Urgence.Urgence;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

public interface IRendezvousService {
    List<Rendezvous> retrieveAllRendezvous();
    Rendezvous retrieveRendezvous(Long idRendezvous);
    Rendezvous addRendezvous(Rendezvous rendezvous, Integer idUser);
    void removeRendezvous(Long idRendezvous);
    Rendezvous modifyRendezvous(Rendezvous rendezvous, Long idUser);
    boolean isHoraireDisponible(LocalDate date, LocalTime heure);
    List<String> getSuggestedTimes(LocalDate date, String desiredTime);
    List<Rendezvous> getAllRendezvous();
    void sendReminders();

}


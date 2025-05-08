package tn.dewini.backend.Services.Rdv;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import tn.dewini.backend.Entities.Rdv.Rendezvous;
import tn.dewini.backend.Entities.User.User;
import tn.dewini.backend.Repositories.Rdv.RendezvousRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.dewini.backend.Repositories.User.UserRepo;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
@AllArgsConstructor
@Service
public class RendezvousServiceImpl implements IRendezvousService {

    @Autowired
    private RendezvousRepository rendezvousRepository;


    private final UserRepo utilisateurRepository;


    @Autowired
    private EmailService emailService;

    @Override
    public List<Rendezvous> retrieveAllRendezvous() {
        return rendezvousRepository.findAll();
    }

    @Override
    public Rendezvous retrieveRendezvous(Long idRendezvous) {
        Optional<Rendezvous> rendezvous = rendezvousRepository.findById(idRendezvous);
        return rendezvous.orElse(null);
    }

    @Override
    public Rendezvous addRendezvous(Rendezvous rendezvous,Integer idUser ) {
        rendezvous.setPatient(utilisateurRepository.findById(idUser).get());

        // Vérifie la disponibilité avant d'ajouter
        LocalTime heureRdv = LocalTime.parse(rendezvous.getHeureRendezvous());
        if (!isHoraireDisponible(rendezvous.getDateRendezvous(), heureRdv)) {
            throw new IllegalArgumentException("Ce créneau n'est pas disponible");
        }
        return rendezvousRepository.save(rendezvous);
    }

    @Override
    public void removeRendezvous(Long idRendezvous) {
        rendezvousRepository.deleteById(idRendezvous);
    }


    @Transactional
    @Override
    public Rendezvous modifyRendezvous(Rendezvous rendezvous, Long idUser) {
        Rendezvous existingRdv = rendezvousRepository.findById(rendezvous.getIdRendezvous())
                .orElseThrow(() -> new IllegalArgumentException("Rendez-vous introuvable"));

        // Validation du créneau
        LocalTime newTime = LocalTime.parse(rendezvous.getHeureRendezvous());
        if (!isHoraireDisponible(rendezvous.getDateRendezvous(), newTime)) {
            throw new IllegalArgumentException("Créneau indisponible");
        }


        return rendezvousRepository.save(existingRdv);
    }

    @Override
    public boolean isHoraireDisponible(LocalDate date, LocalTime heure) {
        String heureStr = heure.format(DateTimeFormatter.ofPattern("HH:mm"));
        List<Rendezvous> overlapping = rendezvousRepository.findOverlappingSlots(
                date,
                heureStr
        );
        return overlapping.isEmpty();
    }

    @Override
    public List<String> getSuggestedTimes(LocalDate date, String desiredTime) {
        LocalTime desired = LocalTime.parse(desiredTime);
        List<String> suggestions = new ArrayList<>();
        LocalTime current = desired.plusMinutes(30); // Commence 30 minutes après

        // Cherche jusqu'à 3 créneaux disponibles (par incréments de 5 minutes)
        while (suggestions.size() < 3 && current.isBefore(LocalTime.of(17, 0))) {
            String candidate = current.format(DateTimeFormatter.ofPattern("HH:mm"));
            if (isHoraireDisponible(date, current)) {
                suggestions.add(candidate);
            }
            current = current.plusMinutes(5);
        }

        return suggestions;
    }

    private long calculateMinutesDiff(String time1, String time2) {
        LocalTime t1 = LocalTime.parse(time1);
        LocalTime t2 = LocalTime.parse(time2);
        return Math.abs(Duration.between(t1, t2).toMinutes());
    }

    @Override
    public List<Rendezvous> getAllRendezvous() {
        return rendezvousRepository.findAll();
    }

    @Override
    public void sendReminders() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime in24Hours = now.plusHours(24);

        List<Rendezvous> allRdv = rendezvousRepository.findAll();

        for (Rendezvous rdv : allRdv) {
            try {
                // Skip si pas d'email ou rappel déjà envoyé
                if (rdv.getEmailPatient() == null || rdv.getEmailPatient().isEmpty() || rdv.isReminderSent()) {
                    continue;
                }

                LocalDateTime rdvDateTime = LocalDateTime.of(
                        rdv.getDateRendezvous(),
                        LocalTime.parse(rdv.getHeureRendezvous())
                );

                if (Duration.between(now, rdvDateTime).toHours() >= 23
                        && Duration.between(now, rdvDateTime).toHours() <= 25) {

                    String text = String.format(
                            "Bonjour %s,\n\nVotre rendez-vous médical est prévu le %s à %s.\n\nCordialement,\nVotre cabinet",
                            rdv.getNomPatient(),
                            rdv.getDateRendezvous().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
                            rdv.getHeureRendezvous()
                    );

                    emailService.sendEmail(rdv.getEmailPatient(), "Rappel Rendez-vous", text);

                    // Marquer comme envoyé
                    rdv.setReminderSent(true);
                    rendezvousRepository.save(rdv);
                }
            } catch (Exception e) {
                System.err.println("Erreur rappel ID " + rdv.getIdRendezvous() + ": " + e.getMessage());
            }
        }
    }
}
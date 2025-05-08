package tn.dewini.backend.Services.eve;


public class ScheduledService {
   /* @Autowired
    LieuSelectionService lieuSelectionService;
    @Autowired
    EvenementRepository evenementRepository;

    @Scheduled(cron = "0 0 8 * * *") // chaque jour à 8h
    public void verifierEtAjusterSalles() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime nowPlus2 = now.plusDays(2);
        List<Evenement> evenements = evenementRepository.findByDateDebutProche(now, nowPlus2);
        for (Evenement evt : evenements) {
            Salle salleAdaptee = lieuSelectionService.choisirSalleAdaptee(evt);
            if (salleAdaptee != null) {
                evt.setSalle(salleAdaptee);
                evenementRepository.save(evt);
            }
        }
    }*/

}

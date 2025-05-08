package tn.dewini.backend.Entities.eve;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import tn.dewini.backend.Services.eve.EvenementService;

@Component
public class EvenementScheduler {

    @Autowired
    private EvenementService evenementService;

    @Scheduled(cron = "0 * * * * *") // chaque minute
    public void verifierEvenements() {
        System.out.println("🔄 Vérification des événements...");
        evenementService.annulerEvenementsNonRemplis();
    }
}

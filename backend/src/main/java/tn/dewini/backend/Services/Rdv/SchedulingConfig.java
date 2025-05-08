package tn.dewini.backend.Services.Rdv;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.beans.factory.annotation.Autowired;

@Configuration
@EnableScheduling
public class SchedulingConfig {
    @Autowired
    private IRendezvousService rendezvousService;

    // Exécuté toutes les heures à la minute 0 (00:00, 01:00, etc.)
    @Scheduled(cron = "0 0 * * * *")
    public void sendRemindersJob() {
        rendezvousService.sendReminders();
    }
}

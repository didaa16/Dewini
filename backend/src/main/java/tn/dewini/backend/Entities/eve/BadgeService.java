package tn.dewini.backend.Entities.eve;

import org.springframework.stereotype.Service;

@Service
public class BadgeService {

    public String generateBadgeForEvent(Long eventId) {
        // Logique de génération du badge
        return "data:image/png;base64,..."; // Retourne l'image en base64
    }
}
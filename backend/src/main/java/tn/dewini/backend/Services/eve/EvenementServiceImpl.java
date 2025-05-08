package tn.dewini.backend.Services.eve;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;
import tn.dewini.backend.Entities.eve.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import tn.dewini.backend.Repositories.eve.*;


@PropertySource("classpath:application.properties")
@Service
@AllArgsConstructor
public class EvenementServiceImpl implements EvenementService {
    @Autowired
    WeatherService weatherService;
    @Autowired
    SimpMessagingTemplate messagingTemplate;
    @Autowired
     SalleRepository salleRepository;
    @Autowired
     ParticipantRepository participantRepository;
    @Autowired
  LieuSelectionService lieuSelectionService;
    @Autowired
     ParticipationRepository participationRepository;
    @Autowired
     LieuRepository lieuRepository;
    @Autowired
    EvenementRepository evenementRepository;
    @Autowired
    PaiementService paiementService;
    @Autowired
    EmailService emailService;

    @Autowired
    public EvenementServiceImpl(@Lazy LieuSelectionService lieuSelectionService) {
        this.lieuSelectionService = lieuSelectionService;
    }
    @Override
    public List<Evenement> retrieveAllEvenements() {
        return evenementRepository.findAll();
    }
    @Override
    public Evenement retrieveEvenementById(Long evenementId) {
        return evenementRepository.findById(evenementId).orElse(null);
    }


  /* public Salle ajusterSalleSelonMeteo(Long evenementId) {
        Evenement evenement = evenementRepository.findById(evenementId).orElse(null);
        if (evenement == null) return null;

        Salle salleChoisie = lieuSelectionService.choisirSalleAdaptee(evenement);

        if (salleChoisie != null && !salleChoisie.getId().equals(evenement.getSalle().getId())) {
            evenement.setSalle(salleChoisie);
            evenementRepository.save(evenement);
        }

        return salleChoisie;
    }

    public Double getMeteoActuelle(Long evenementId) {
        Evenement evenement = evenementRepository.findById(evenementId).orElse(null);
        if (evenement == null) return null;

        return lieuSelectionService.getTemperatureEvenement(evenement);
    }*/

    @Transactional
    public Evenement addEvenement(Evenement evenement) {
        if (evenement.getNom() == null || evenement.getNom().isEmpty()) {
            throw new IllegalArgumentException("Le nom de l'événement est obligatoire");
        }

        // Vérification et association du lieu
        if (evenement.getLieu() == null || evenement.getLieu().getId() == null) {
            throw new IllegalArgumentException("Un lieu valide doit être spécifié");
        }

        Lieu lieu = lieuRepository.findById(evenement.getLieu().getId())
                .orElseThrow(() -> new RuntimeException("Lieu introuvable avec l'ID: " + evenement.getLieu().getId()));

        evenement.setLieu(lieu);

        // Validation des dates
        if (evenement.getDateDebut() == null || evenement.getDateFin() == null) {
            throw new IllegalArgumentException("Les dates de début et fin sont obligatoires");
        }

        if (evenement.getDateDebut().isAfter(evenement.getDateFin())) {
            throw new IllegalArgumentException("La date de fin doit être après la date de début");
        }

        // Sauvegarde de l'événement
        return evenementRepository.save(evenement);
    }

    public List<Evenement> getAllEvenements() {
        return evenementRepository.findAll();
    }
    @Override
    public void removeEvenement(Long evenementId) {
        evenementRepository.deleteById(evenementId);
    }


    @Transactional
    public Evenement modifyEvenement(Long id, Evenement evenementDetails) {
        Evenement existing = evenementRepository.findByIdWithParticipations(id)
                .orElseThrow(() -> new RuntimeException("Événement non trouvé"));

        // Copie sélective des propriétés
        existing.setNom(evenementDetails.getNom());
        existing.setDateDebut(evenementDetails.getDateDebut());
        // ... autres setters

        return evenementRepository.save(existing);
    }
    public List<Evenement> retrieveUpcomingEvenements() {
        return evenementRepository.findByDateDebutAfter(LocalDateTime.now()); // Utiliser LocalDateTime
    }

    @Override
    public Participation inscrireParticipant(Long evenementId, Participant participant) {
        Evenement evenement = evenementRepository.findById(evenementId)
                .orElseThrow(() -> new RuntimeException("Événement non trouvé"));

        participant.setEvenement(evenement);
        participant.setDateEngagement(LocalDateTime.now());
        participantRepository.save(participant);

        Participation participation = new Participation();
        participation.setEvenement(evenement);
        participation.setEngagement(participant);
        participation.setStatut(StatutParticipation.INSCRIT);
        participation.setDateInscription(LocalDateTime.now());
        participation.setPresence(false);
        participation.setEvaluationNote(0);
        participation.setCommentaire("");

        BigDecimal tarif = calculerTarif(evenement);
        participation.setPrixPaye(tarif);



        participationRepository.save(participation);
        return participation;
    }

    private BigDecimal calculerTarif(Evenement evenement) {
        if (evenement.getPrix().compareTo(BigDecimal.ZERO) <= 0) return BigDecimal.ZERO;

        int nbParticipants = participationRepository
                .findAll()
                .stream()
                .filter(p -> p.getEvenement().getId().equals(evenement.getId()))
                .toList()
                .size();

        if (nbParticipants >= evenement.getSeuilMinimum()) {
            return evenement.getPrix().multiply(BigDecimal.valueOf(0.9));
        } else {
            return evenement.getPrix();
        }
    }

    @Override
    public void annulerParticipation(Long participationId) {
        Participation participation = participationRepository.findById(participationId)
                .orElseThrow(() -> new RuntimeException("Participation non trouvée"));

        participation.setStatut(StatutParticipation.ANNULE);
        participationRepository.save(participation);
        // remboursement ici
        double montant = participation.getPrixPaye().doubleValue();
        rembourser(montant);

    }

    private void rembourser(double montant) {
        // Simuler remboursement ici ou appeler un service externe
        System.out.println("Remboursement effectué de : " + montant + " DT");
    }


    @Override
    public void verifierSeuilEtAnnulerEvenement(Long evenementId) {
        Evenement evenement = evenementRepository.findById(evenementId)
                .orElseThrow(() -> new RuntimeException("Événement non trouvé"));

        // Compare LocalDateTime directly
        if (LocalDateTime.now().isAfter(evenement.getDateDebut())) {
            long nbInscrits = participationRepository
                    .findAll()
                    .stream()
                    .filter(p -> p.getEvenement().getId().equals(evenementId))
                    .count();

            if (nbInscrits < evenement.getSeuilMinimum()) {
                evenementRepository.delete(evenement);
                System.out.println("Événement annulé car le seuil n'est pas atteint !");
            }
        }
    }

    @Override
    public Optional<Evenement> findById(Long evenementId) {
        return evenementRepository.findById(evenementId);
    }

    public List<Participant> getParticipantsByEvenementId(Long evenementId) {
        // Récupérer toutes les participations associées à un événement
        List<Participation> participations = participationRepository.findByEvenementId(evenementId);

        // Extraire les participants uniques
        return participations.stream()
                .map(Participation::getEngagement)
                .distinct()
                .collect(Collectors.toList());
    }

    @Override
    public void annulerEvenementsNonRemplis() {
        // Récupération des événements à vérifier
        List<Evenement> evenements = evenementRepository.findEvenementsAVerifier();
        for (Evenement e : evenements) {
            System.out.println("⏳ Traitement de l'événement : " + e.getNom());
            System.out.println("🧾 Nombre de participations : " + e.getParticipations().size());

            // Vérification du seuil
            if (e.getParticipations().size() < e.getSeuilMinimum()) {
                System.out.println("🚨 L'événement " + e.getNom() + " a moins de participants que le seuil.");
                annulerEtNotifier(e); // Appel à la méthode d'annulation
            } else {
                System.out.println("✅ L'événement " + e.getNom() + " a suffisamment de participants.");
            }
        }
    }

    public void annulerEtNotifier(Evenement event) {
        // Validation de l'entrée
        if (event == null) {
            throw new IllegalArgumentException("L'événement ne peut pas être null");
        }

        // Récupération des participations
        List<Participation> participations = event.getParticipations();
        if (participations == null || participations.isEmpty()) {
            System.out.println("⚠️ Aucun participant trouvé pour l'événement " + event.getNom());
            return;
        }

        // Traitement pour chaque participation
        for (Participation participation : participations) {
            participantRepository.delete(participation.getEngagement());
            // Calcul du montant de remboursement (28%)
            BigDecimal prixPaye = participation.getPrixPaye();
            BigDecimal tauxRemboursement = new BigDecimal("0.28");
            BigDecimal montantRembourse = prixPaye.multiply(tauxRemboursement)
                    .setScale(2, RoundingMode.HALF_UP);

            // Envoi de l'email de notification
            String emailParticipant = "hibabr717@gmail.com";  // Remplacer par l'email réel
            if (emailParticipant != null && !emailParticipant.isBlank()) {
                emailService.envoyerEmailAnnulation(
                        emailParticipant,
                        event.getNom(), // Nom de l'événement
                        montantRembourse
                );
                System.out.println("📧 Email envoyé à " + emailParticipant);
            }

            // Suppression des participations et de l'événement
            participationRepository.delete(participation);
            System.out.println("❌ Participation supprimée pour l'événement : " + event.getNom());
        }

        // Suppression de l'événement
        evenementRepository.delete(event);
        System.out.println("❌ L'événement " + event.getNom() + " a été annulé et supprimé.");
    }

    public List<Evenement> getEventsWithCoordinates() {
        return evenementRepository.findEvenementsWithCoordinates();
    }

    public Evenement getEventDetails(Long id) {
        return evenementRepository.findEvenementDetails(id)
                .orElseThrow(() -> new RuntimeException("Événement non trouvé"));
    }

    public List<Evenement> getNearbyEvents(double lat, double lng, double radiusKm) {
        double radiusMeters = radiusKm * 1000;
        return evenementRepository.findNearbyEvents(lat, lng, radiusMeters);
    }

    public Evenement updateEventCoordinates(Long eventId, double lat, double lng) {
        Evenement event = evenementRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Événement non trouvé"));

        event.setCoordonnees(new coordonnees(lat, lng));
        return evenementRepository.save(event);
    }


    public String adjustEvent(Long eventId) {
        Optional<Evenement> evenementOpt = evenementRepository.findById(eventId);
        if (evenementOpt.isEmpty()) {
            return "Échec de l'ajustement : événement non trouvé.";
        }

        Evenement evenement = evenementOpt.get();
        Lieu lieuActuel = evenement.getLieu();
        if (lieuActuel == null) {
            return "Échec de l'ajustement : aucun lieu associé à l'événement.";
        }

        double latitude;
        double longitude;
        coordonnees coords = evenement.getCoordonnees();
        if (coords == null || (coords.getLatitude() == 0 && coords.getLongitude() == 0)) {
            coords = lieuActuel.getCoordonnees();
            if (coords == null || (coords.getLatitude() == 0 && coords.getLongitude() == 0)) {
                return "Échec de l'ajustement : coordonnées non disponibles pour l'événement ou le lieu.";
            }
        }
        latitude = coords.getLatitude();
        longitude = coords.getLongitude();

        WeatherData weather = weatherService.getWeatherForAdjustment(latitude, longitude);
        if (weather == null || weather.getWeather() == null || weather.getWeather().length == 0) {
            return "Échec de l'ajustement : impossible de récupérer la météo.";
        }

        String condition = weather.getWeather()[0].getMain();
        boolean isBadWeather = condition.equals("Rain") || condition.equals("Thunderstorm") || condition.equals("Snow");

        String message = "";
        if (lieuActuel.isEstExterieur() && isBadWeather) {
            List<Lieu> lieuxInterieurs = lieuRepository.findByEstExterieurFalse();
            if (lieuxInterieurs.isEmpty()) {
                return "Échec de l'ajustement : aucun lieu intérieur disponible.";
            }

            Lieu nouveauLieu = lieuxInterieurs.get(0);
            evenement.setLieu(nouveauLieu);

            List<Salle> salles = salleRepository.findAll();
            if (salles.isEmpty()) {
                return "Échec de l'ajustement : aucune salle disponible.";
            }
            Salle nouvelleSalle = salles.get(0);
            evenement.setSalle(nouvelleSalle);

            message = String.format("L'événement %s a été déplacé vers le lieu %s (intérieur) et la salle %s en raison de la météo (%s).",
                    evenement.getNom(), nouveauLieu.getNom(), nouvelleSalle.getNom(), condition);
        } else if (!lieuActuel.isEstExterieur() && !isBadWeather) {
            List<Lieu> lieuxExterieurs = lieuRepository.findByEstExterieurTrue();
            if (lieuxExterieurs.isEmpty()) {
                return "Échec de l'ajustement : aucun lieu extérieur disponible.";
            }

            Lieu nouveauLieu = lieuxExterieurs.get(0);
            evenement.setLieu(nouveauLieu);
            evenement.setSalle(null);

            message = String.format("L'événement %s a été déplacé vers le lieu %s (extérieur) en raison de la météo (%s).",
                    evenement.getNom(), nouveauLieu.getNom(), condition);
        } else {
            message = String.format("Aucun ajustement nécessaire pour l'événement %s (météo : %s).",
                    evenement.getNom(), condition);
        }

        evenementRepository.save(evenement);
        return message;
    }

    public WeatherInfo getWeatherForEvent(Long eventId) {
        Optional<Evenement> evenementOpt = evenementRepository.findById(eventId);
        if (evenementOpt.isEmpty()) {
            throw new RuntimeException("Événement non trouvé.");
        }

        Evenement evenement = evenementOpt.get();
        Lieu lieu = evenement.getLieu();
        if (lieu == null) {
            throw new RuntimeException("Aucun lieu associé à l'événement.");
        }

        double latitude;
        double longitude;
        coordonnees coords = evenement.getCoordonnees();
        if (coords == null || (coords.getLatitude() == 0 && coords.getLongitude() == 0)) {
            coords = lieu.getCoordonnees();
            if (coords == null || (coords.getLatitude() == 0 && coords.getLongitude() == 0)) {
                throw new RuntimeException("Coordonnées non disponibles pour l'événement ou le lieu.");
            }
        }
        latitude = coords.getLatitude();
        longitude = coords.getLongitude();

        return weatherService.getWeather(latitude, longitude);
    }




}

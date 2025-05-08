package tn.dewini.backend.Services.eve;

import tn.dewini.backend.Entities.eve.Evenement;
import tn.dewini.backend.Entities.eve.Participant;
import tn.dewini.backend.Entities.eve.Participation;

import java.util.List;
import java.util.Optional;


public interface EvenementService {
    List<Evenement> retrieveAllEvenements();
    Evenement retrieveEvenementById(Long evenementId);
    Evenement addEvenement(Evenement evenement);
    void removeEvenement(Long evenementId);
    Evenement modifyEvenement(Long id,Evenement evenement);
     List<Evenement> retrieveUpcomingEvenements();
    Participation inscrireParticipant(Long evenementId, Participant participant);
    void annulerParticipation(Long participationId);
    void verifierSeuilEtAnnulerEvenement(Long evenementId);
    void annulerEtNotifier(Evenement event);

    Optional<Evenement> findById(Long evenementId);
    void annulerEvenementsNonRemplis();
    List<Participant> getParticipantsByEvenementId(Long evenementId);
     List<Evenement> getEventsWithCoordinates();

    Evenement getEventDetails(Long id) ;

     List<Evenement> getNearbyEvents(double lat, double lng, double radiusKm) ;
     Evenement updateEventCoordinates(Long eventId, double lat, double lng) ;

     //Salle ajusterSalleSelonMeteo(Long evenementId);
   // Double getMeteoActuelle(Long evenementId);
     WeatherInfo getWeatherForEvent(Long eventId);

    String adjustEvent(Long eventId);



}

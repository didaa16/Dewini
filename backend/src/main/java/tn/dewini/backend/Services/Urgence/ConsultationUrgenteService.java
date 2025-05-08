package tn.dewini.backend.Services.Urgence;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.dewini.backend.Entities.Urgence.ConsultationUrgente;
import tn.dewini.backend.Entities.Urgence.Urgence;
import tn.dewini.backend.Repositories.Urgence.ConsultationUrgenteRepository;
import tn.dewini.backend.Repositories.Urgence.UrgenceRepository;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Call;
import com.twilio.type.PhoneNumber;

import java.net.URI;
import java.net.URISyntaxException;

@Service
@AllArgsConstructor
public class ConsultationUrgenteService implements IConsultationUrgenteService {
    @Autowired
    ConsultationUrgenteRepository consultationUrgenteRepository;
    @Autowired
    UrgenceRepository urgenceRepository;
    @Override
    public List<ConsultationUrgente> retrieveAllConsultationUrgentes() {
        return consultationUrgenteRepository.findAll();
    }

    @Override
    public ConsultationUrgente retrieveConsultationUrgente(Long idConsultation) {
        return consultationUrgenteRepository.findById(idConsultation).orElse(null);
    }

    @Override
    public ConsultationUrgente addConsultationUrgente(ConsultationUrgente cu) {
        cu.setAmbulance(false);
        cu.setDate(new Date());
        cu.setLienVideo(null);
        return consultationUrgenteRepository.save(cu);
    }

    @Override
    public void removeConsultationUrgente(Long idConsultation) {
        // Récupérer la consultation urgente par son ID
        ConsultationUrgente consultationUrgente = consultationUrgenteRepository.findById(idConsultation)
                .orElseThrow(() -> new RuntimeException("Consultation urgente non trouvée"));

        // Récupérer l'urgence associée
        Urgence urgence = consultationUrgente.getUrgence();

        // Annuler la relation entre l'urgence et la consultation urgente
        if (urgence != null) {
            urgence.setConsultationUrgente(null);
        }

        // Supprimer la consultation urgente
        consultationUrgenteRepository.deleteById(idConsultation);
    }


    @Override
    public ConsultationUrgente modifyConsultationUrgente(ConsultationUrgente updatedConsultationUrgente) {
        // Récupérer la consultation existante
        ConsultationUrgente existingConsultation = consultationUrgenteRepository.findById(updatedConsultationUrgente.getIdConsultationUrgente())
                .orElseThrow(() -> new RuntimeException("Consultation d'urgence non trouvée avec l'ID : " + updatedConsultationUrgente.getIdConsultationUrgente()));

        // Mettre à jour uniquement les champs non nuls
        if (updatedConsultationUrgente.getUrgence() != null) {
            existingConsultation.setUrgence(updatedConsultationUrgente.getUrgence());
        }
        if (updatedConsultationUrgente.getDate() != null) {
            existingConsultation.setDate(updatedConsultationUrgente.getDate());
        }
        if (updatedConsultationUrgente.getLienVideo() != null) {
            existingConsultation.setLienVideo(updatedConsultationUrgente.getLienVideo());
        }
        if (updatedConsultationUrgente.getAmbulance() != null) {
            existingConsultation.setAmbulance(updatedConsultationUrgente.getAmbulance());
        }

        // Sauvegarder les modifications
        return consultationUrgenteRepository.save(existingConsultation);
    }
    @Override
    public ConsultationUrgente prendreEnChargeUrgence(Long idUrgence, String lienVideo) {
        // Récupérer l'urgence
        Urgence urgence = urgenceRepository.findById(idUrgence)
                .orElseThrow(() -> new RuntimeException("Urgence non trouvée"));

        // Vérifier si une consultation existe déjà
        if (urgence.getConsultationUrgente() != null) {
            throw new RuntimeException("Cette urgence a déjà été prise en charge !");
        }

        // Créer une nouvelle consultation urgente
        ConsultationUrgente consultation = new ConsultationUrgente();
        consultation.setUrgence(urgence);
        consultation.setDate(new Date());
        consultation.setLienVideo(lienVideo); // Stocker le lien vidéo
        consultation.setAmbulance(false);

        // Sauvegarder la consultation
        consultation = consultationUrgenteRepository.save(consultation);

        // Lier l'urgence à la consultation
        urgence.setConsultationUrgente(consultation);
        urgenceRepository.save(urgence);

        return consultation;
    }



    private final static String TWILIO_ACCOUNT_SID = "#################";
    private final static String TWILIO_AUTH_TOKEN = "#################";
    private final static String TWILIO_PHONE_NUMBER = "+#################";

    @Override
    public ConsultationUrgente ambulance(Long idConsultationUrgente) {
        ConsultationUrgente consultationUrgente = consultationUrgenteRepository.findById(idConsultationUrgente)
                .orElseThrow(() -> new RuntimeException("Consultation non trouvée"));
        Urgence urgence = urgenceRepository.findByConsultationUrgenteId(idConsultationUrgente);

        if (urgence == null) {
            throw new RuntimeException("Aucune urgence associée à cette consultation");
        }
        boolean previousState = consultationUrgente.getAmbulance();
        consultationUrgente.setAmbulance(!previousState);

        ConsultationUrgente saved = consultationUrgenteRepository.save(consultationUrgente);

        if(saved.getAmbulance()) {
            triggerAmbulanceCall(urgence); // Passer l'urgence à la méthode
        }
        return saved;
    }

    private void triggerAmbulanceCall(Urgence urgence) {
        try {
            Twilio.init(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

            String address = urgence.getAddressePatient() != null ?
                    urgence.getAddressePatient() :
                    "Adresse non spécifiée";

            String encodedAddress = URLEncoder.encode(address, StandardCharsets.UTF_8.toString());
            String twimlUrl = "https://handler.twilio.com/twiml/#################" +
                    "?emergency_address=" + encodedAddress;
            Call call = Call.creator(
                    new PhoneNumber("+21629096179"),
                    new PhoneNumber(TWILIO_PHONE_NUMBER),
                    new URI(twimlUrl)
            ).create();
            System.out.println("Appel ambulance envoyé à l'adresse : " + address);
            System.out.println("Call SID: " + call.getSid());

        } catch (URISyntaxException | UnsupportedEncodingException e) {
            throw new RuntimeException("Erreur lors de l'appel ambulance", e);
        }
    }


}

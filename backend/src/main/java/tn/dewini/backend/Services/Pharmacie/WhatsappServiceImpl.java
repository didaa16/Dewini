package tn.dewini.backend.Services.Pharmacie;

import com.twilio.Twilio;
import com.twilio.exception.ApiException;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class WhatsappServiceImpl implements IWhatsAppService {


    @Value("${twilio.whatsapp.from}")
    private String fromWhatsApp;

    @Override
    public void envoyerLienPdf(String numeroPatient, String lienPdf) {
        try {
            Message.creator(
                    new PhoneNumber("whatsapp:" + numeroPatient),
                    new PhoneNumber(fromWhatsApp),
                    "🧠 Bonjour, voici votre rapport DEWINI : " + lienPdf
            ).create();
        } catch (ApiException e) {
            throw new RuntimeException("Échec d'envoi WhatsApp: " + e.getMessage(), e);
        }
    }


}
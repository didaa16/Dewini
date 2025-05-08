package tn.dewini.backend.Services.eve;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class EmailService  {

    @Autowired
    private JavaMailSender mailSender;


    public void envoyerEmailAnnulation(String email, String nomEvenement, BigDecimal montant) {

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Annulation: " + nomEvenement);

            String texte = String.format(
                    "L'événement %s a été annulé.\n" +
                            "Remboursement: %s DT (28%%)\n\n" +
                            "Cordialement,\nVotre équipe",
                    nomEvenement, montant.toString());

            message.setText(texte);
            mailSender.send(message);



    }
}
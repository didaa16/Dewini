package tn.dewini.backend.Services.Consultation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailServiceConsultation {
    private static final Logger logger = LoggerFactory.getLogger(EmailServiceConsultation.class);

    @Autowired
    private JavaMailSender emailSender;

    public void sendEmail(String to, String subject, String content) {
        try {
            logger.info("Tentative d'envoi d'email à : {}", to);
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(content);
            emailSender.send(message);
            logger.info("Email envoyé avec succès à : {}", to);
        } catch (Exception e) {
            logger.error("Erreur lors de l'envoi de l'email à : {} - Erreur : {}", to, e.getMessage());
            throw new RuntimeException("Erreur lors de l'envoi de l'email : " + e.getMessage());
        }
    }
}

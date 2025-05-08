package tn.dewini.backend.Services.User;

import tn.dewini.backend.Handlers.EmailSendingException;
import tn.dewini.backend.Template.EmailTemplateName;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.nio.charset.StandardCharsets;
import java.util.Map;

@Slf4j
@Service("userEmailService")
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${application.mailing.from-name}")
    private String fromName;

    @Async
    public void sendEmail(
            String to,
            String username,
            EmailTemplateName emailTemplate,
            Map<String, Object> variables,
            String subject
    ) {
        try {
            log.info("Preparing to send email to: {}", to);

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(
                    mimeMessage,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name()
            );

            helper.setFrom(fromName + " <" + fromEmail + ">");
            helper.setTo(to);
            helper.setSubject(subject);

            variables.putIfAbsent("username", username);
            Context context = new Context();
            context.setVariables(variables);

            // Chemin corrigé - enlevez "emails/" car le prefix est déjà configuré
            String templatePath = emailTemplate.getTemplateName(); // Supprimez "emails/"
            log.debug("Loading email template from: {}", templatePath);

            String htmlContent = templateEngine.process(templatePath, context);
            helper.setText(htmlContent, true);

            mailSender.send(mimeMessage);
            log.info("Email sent successfully to {}", to);
        } catch (MessagingException e) {
            log.error("Failed to send email to {}", to, e);
            throw new EmailSendingException("Failed to send email to " + to, e);
        } catch (Exception e) {
            log.error("Unexpected error while sending email", e);
            throw new EmailSendingException("Unexpected error while sending email", e);
        }
    }
}
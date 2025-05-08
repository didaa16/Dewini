package tn.dewini.backend.Services.Rdv;

import com.twilio.Twilio;
import com.twilio.exception.ApiException;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SmsService {

    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @Value("${twilio.phone.from}")
    private String fromNumber;

    @Value("${sms.test.number}")
    private String testNumber;

    @PostConstruct
    public void init() {
        Twilio.init(accountSid, authToken);
    }

    public void sendSms(String messageBody) {
        try {
            Message.creator(
                    new PhoneNumber(testNumber),
                    new PhoneNumber(fromNumber),
                    messageBody
            ).create();
        } catch (ApiException e) {
            throw new RuntimeException("Échec d'envoi SMS: " + e.getMessage(), e);
        }
    }


}
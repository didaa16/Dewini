package tn.dewini.backend.Configs.Pharmacie;

// src/main/java/ton/package/config/TwilioConfig.java

import com.twilio.Twilio;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class TwilioConfig {

    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @PostConstruct
    public void initTwilio() {
        Twilio.init(accountSid, authToken);
    }
}


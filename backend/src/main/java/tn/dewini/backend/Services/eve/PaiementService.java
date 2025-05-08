package tn.dewini.backend.Services.eve;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import tn.dewini.backend.Entities.eve.Evenement;
import tn.dewini.backend.Entities.eve.Participant;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
public class PaiementService {

    @Value("${stripe.key.secret}")
    private String stripeKey;

    @Value("${frontend.success-url}")
    private String successUrl;

    @Value("${frontend.cancel-url}")
    private String cancelUrl;

    public String creerSessionPaiement(Participant participant, Evenement evenement) {
        // Vérification des paramètres d'entrée
        if (participant == null || evenement == null || evenement.getPrix() == null || evenement.getPrix().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Participant ou événement invalide.");
        }

        Stripe.apiKey = stripeKey;

        Map<String, String> metadata = new HashMap<>();
        metadata.put("participation_id", participant.getId().toString());

        // Calcul du prix en centimes
        long priceInCents = evenement.getPrix().multiply(BigDecimal.valueOf(100)).longValue();

        SessionCreateParams params = SessionCreateParams.builder()
                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(successUrl + "?session_id={CHECKOUT_SESSION_ID}")
                .setCancelUrl(cancelUrl)
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity(1L)
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency("eur")
                                                .setUnitAmount(priceInCents)
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName(evenement.getNom())
                                                                .build())
                                                .build())
                                .build())
                .putAllMetadata(metadata)
                .build();

        try {
            // Création de la session Stripe
            Session session = Session.create(params);
            return session.getUrl();
        } catch (StripeException e) {
            // Gestion des erreurs spécifiques de Stripe
            throw new RuntimeException("Erreur Stripe lors de la création de la session de paiement : " + e.getMessage(), e);
        }
    }
    public void rembourser(String email, double montant) {
        // Appeler l’API Stripe ou simuler
        System.out.println("Remboursement de " + montant + " DT à " + email);
    }
}

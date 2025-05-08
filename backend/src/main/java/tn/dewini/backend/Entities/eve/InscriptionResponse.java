package tn.dewini.backend.Entities.eve;


public record InscriptionResponse(
        boolean requiresPayment,
        String paymentUrl
) {}

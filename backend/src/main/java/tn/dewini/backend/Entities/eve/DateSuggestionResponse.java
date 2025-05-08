package tn.dewini.backend.Entities.eve;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

public class DateSuggestionResponse {
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    @JsonProperty("date_recommandee")
    private String dateRecommandee;
    @JsonProperty("taux_participation_estime")
    private double tauxParticipationEstime;

    @JsonProperty("nombre_participants")
    private int nombreParticipants;
    // Getters and Setters
    public String getDateRecommandee() {
        return dateRecommandee;
    }

    public void setDateRecommandee(String dateRecommandee) {
        this.dateRecommandee = dateRecommandee;
    }

    public double getTauxParticipationEstime() {
        return tauxParticipationEstime;
    }

    public void setTauxParticipationEstime(double tauxParticipationEstime) {
        this.tauxParticipationEstime = tauxParticipationEstime;
    }

    public int getNombreParticipants() {
        return nombreParticipants;
    }

    public void setNombreParticipants(int nombreParticipants) {
        this.nombreParticipants = nombreParticipants;
    }
}
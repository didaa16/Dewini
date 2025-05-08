package tn.dewini.backend.Entities.eve;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class PredictionResponseDTO {
    @JsonProperty("participant_id")
    private Long participantId;

    @JsonProperty("evenement_id")
    private Long evenementId;

    private float prix;
    private int salle;
    private int lieu;
    private String nom;

    @JsonProperty("prix_paye")
    private float prixPaye;

    private int statut;

    @JsonProperty("type_engagement")
    private int typeEngagement;

    private int role;

    @JsonProperty("type_participant")
    private int typeParticipant;

    @JsonProperty("attendance_likelihood")
    private float attendanceLikelihood;

    @JsonProperty("predicted_attendance")
    private boolean predictedAttendance;

    private List<String> suggestions;

    // Getters and Setters
    public Long getParticipantId() { return participantId; }
    public void setParticipantId(Long participantId) { this.participantId = participantId; }
    public Long getEvenementId() { return evenementId; }
    public void setEvenementId(Long evenementId) { this.evenementId = evenementId; }
    public float getPrix() { return prix; }
    public void setPrix(float prix) { this.prix = prix; }
    public int getSalle() { return salle; }
    public void setSalle(int salle) { this.salle = salle; }
    public int getLieu() { return lieu; }
    public void setLieu(int lieu) { this.lieu = lieu; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public float getPrixPaye() { return prixPaye; }
    public void setPrixPaye(float prixPaye) { this.prixPaye = prixPaye; }
    public int getStatut() { return statut; }
    public void setStatut(int statut) { this.statut = statut; }
    public int getTypeEngagement() { return typeEngagement; }
    public void setTypeEngagement(int typeEngagement) { this.typeEngagement = typeEngagement; }
    public int getRole() { return role; }
    public void setRole(int role) { this.role = role; }
    public int getTypeParticipant() { return typeParticipant; }
    public void setTypeParticipant(int typeParticipant) { this.typeParticipant = typeParticipant; }
    public float getAttendanceLikelihood() { return attendanceLikelihood; }
    public void setAttendanceLikelihood(float attendanceLikelihood) { this.attendanceLikelihood = attendanceLikelihood; }
    public boolean isPredictedAttendance() { return predictedAttendance; }
    public void setPredictedAttendance(boolean predictedAttendance) { this.predictedAttendance = predictedAttendance; }
    public List<String> getSuggestions() { return suggestions; }
    public void setSuggestions(List<String> suggestions) { this.suggestions = suggestions; }
}
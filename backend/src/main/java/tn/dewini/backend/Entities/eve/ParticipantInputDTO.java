package tn.dewini.backend.Entities.eve;




import com.fasterxml.jackson.annotation.JsonProperty;

public class ParticipantInputDTO {
    @JsonProperty("participant_id")
    private Long participantId;

    @JsonProperty("evenement_id")
    private Long evenementId;

    private float prix;

    private String salle;

    private String lieu;

    private String nom;

    @JsonProperty("prix_paye")
    private float prixPaye;

    private String statut;

    @JsonProperty("type_engagement")
    private String typeEngagement;
    @JsonProperty("role")
    private String role;

    @JsonProperty("type_participant")
    private String typeParticipant;

    // Constructeur
    public ParticipantInputDTO(Long participantId, Long evenementId, float prix, String salle, String lieu,
                               String nom, float prixPaye, String statut, String typeEngagement,
                               String role, String typeParticipant) {
        this.participantId = participantId;
        this.evenementId = evenementId;
        this.prix = prix;
        this.salle = salle;
        this.lieu = lieu;
        this.nom = nom;
        this.prixPaye = prixPaye;
        this.statut = statut;
        this.typeEngagement = typeEngagement;
        this.role = role;
        this.typeParticipant = typeParticipant;
    }

    // Getters et Setters
    public Long getParticipantId() { return participantId; }
    public void setParticipantId(Long participantId) { this.participantId = participantId; }
    public Long getEvenementId() { return evenementId; }
    public void setEvenementId(Long evenementId) { this.evenementId = evenementId; }
    public float getPrix() { return prix; }
    public void setPrix(float prix) { this.prix = prix; }
    public String getSalle() { return salle; }
    public void setSalle(String salle) { this.salle = salle; }
    public String getLieu() { return lieu; }
    public void setLieu(String lieu) { this.lieu = lieu; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public float getPrixPaye() { return prixPaye; }
    public void setPrixPaye(float prixPaye) { this.prixPaye = prixPaye; }
    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }
    public String getTypeEngagement() { return typeEngagement; }
    public void setTypeEngagement(String typeEngagement) { this.typeEngagement = typeEngagement; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getTypeParticipant() { return typeParticipant; }
    public void setTypeParticipant(String typeParticipant) { this.typeParticipant = typeParticipant; }
}
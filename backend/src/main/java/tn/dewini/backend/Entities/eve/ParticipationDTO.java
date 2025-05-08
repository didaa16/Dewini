package tn.dewini.backend.Entities.eve;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ParticipationDTO {
    private Long id;
    private Evenement evenement;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Evenement getEvenement() {
        return evenement;
    }

    public void setEvenement(Evenement evenement) {
        this.evenement = evenement;
    }

    public Participant getEngagement() {
        return engagement;
    }

    public void setEngagement(Participant engagement) {
        this.engagement = engagement;
    }

    public StatutParticipation getStatut() {
        return statut;
    }

    public void setStatut(StatutParticipation statut) {
        this.statut = statut;
    }

    public LocalDateTime getDateInscription() {
        return dateInscription;
    }

    public void setDateInscription(LocalDateTime dateInscription) {
        this.dateInscription = dateInscription;
    }

    public Boolean getPresence() {
        return presence;
    }

    public void setPresence(Boolean presence) {
        this.presence = presence;
    }

    public Double getPrixPaye() {
        return prixPaye;
    }

    public void setPrixPaye(Double prixPaye) {
        this.prixPaye = prixPaye;
    }

    public Integer getEvaluationNote() {
        return evaluationNote;
    }

    public void setEvaluationNote(Integer evaluationNote) {
        this.evaluationNote = evaluationNote;
    }

    public String getCommentaire() {
        return commentaire;
    }

    public void setCommentaire(String commentaire) {
        this.commentaire = commentaire;
    }

    private Participant engagement;
    private StatutParticipation statut;
    private LocalDateTime dateInscription;
    private Boolean presence;
    private Double prixPaye;
    private Integer evaluationNote;
    private String commentaire;
}
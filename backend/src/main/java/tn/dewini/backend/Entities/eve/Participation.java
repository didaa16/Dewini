package tn.dewini.backend.Entities.eve;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;


@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class Participation {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne
        @JoinColumn(name = "evenement_id", nullable = false)
        private Evenement evenement;

        @ManyToOne
        @JoinColumn(name = "participantId", nullable = false)
        private Participant engagement;
        @Enumerated(EnumType.STRING)
        private StatutParticipation statut;

        private LocalDateTime dateInscription;

        private boolean presence;

        private BigDecimal prixPaye;

        private Integer evaluationNote;

        private String commentaire;

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

        public boolean isPresence() {
                return presence;
        }

        public void setPresence(boolean presence) {
                this.presence = presence;
        }

        public BigDecimal getPrixPaye() {
                return prixPaye;
        }

        public void setPrixPaye(BigDecimal prixPaye) {
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




    // Getters and setters
}

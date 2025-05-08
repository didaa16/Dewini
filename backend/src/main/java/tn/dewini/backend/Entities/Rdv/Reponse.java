package tn.dewini.backend.Entities.Rdv;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Reponse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idReponse;

    @Column(nullable = false)
    private String contenu;

    public enum StatutReponse {
        ACCEPTED, REFUSED
    }

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private StatutReponse statut;
    public enum EtatTraitement {
        NON_TRAITE, TRAITE
    }

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private EtatTraitement etat = EtatTraitement.NON_TRAITE;

    // Relation plusieurs-à-un avec Rendezvous
    @ManyToOne
    @JoinColumn(name = "rendezvous_id", nullable = false)
    @JsonBackReference
    private Rendezvous rendezvous; // Référence à un rendez-vous

    // Getters and Setters
    public Long getIdReponse() {
        return idReponse;
    }

    public void setIdReponse(Long idReponse) {
        this.idReponse = idReponse;
    }

    public String getContenu() {
        return contenu;
    }

    public void setContenu(String contenu) {
        this.contenu = contenu;
    }

    public StatutReponse getStatut() {
        return statut;
    }

    public void setStatut(StatutReponse statut) {
        this.statut = statut;
    }

    public Rendezvous getRendezvous() {
        return rendezvous;
    }

    public void setRendezvous(Rendezvous rendezvous) {
        this.rendezvous = rendezvous;
    }
    public EtatTraitement getEtat() {
        return etat;
    }

    public void setEtat(EtatTraitement etat) {
        this.etat = etat;
    }

}

package tn.dewini.backend.Entities.eve;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Lieu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public boolean isEstExterieur() {
        return estExterieur;
    }

    public void setEstExterieur(boolean estExterieur) {
        this.estExterieur = estExterieur;
    }

    public List<Evenement> getEvenements() {
        return evenements;
    }

    public void setEvenements(List<Evenement> evenements) {
        this.evenements = evenements;
    }

    public tn.dewini.backend.Entities.eve.coordonnees getCoordonnees() {
        return coordonnees;
    }

    public void setCoordonnees(tn.dewini.backend.Entities.eve.coordonnees coordonnees) {
        this.coordonnees = coordonnees;
    }

    private String nom;
    private boolean estExterieur;
    @JsonIgnore
    @OneToMany(mappedBy = "lieu")
    private List<Evenement> evenements;
    @Embedded
    private coordonnees coordonnees;
}

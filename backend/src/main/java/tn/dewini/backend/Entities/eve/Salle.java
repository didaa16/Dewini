package tn.dewini.backend.Entities.eve;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Salle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nom;
    private int capacite;
    private boolean climatisee;
    private boolean chauffage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lieu_id")
    private Lieu lieu;
    // ✅ Ajoute les getters
    public boolean isClimatisee() {
        return climatisee;
    }

    public boolean isChauffage() {
        return chauffage;
    }

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

    public int getCapacite() {
        return capacite;
    }

    public void setCapacite(int capacite) {
        this.capacite = capacite;
    }

    public Lieu getLieu() {
        return lieu;
    }

    public void setLieu(Lieu lieu) {
        this.lieu = lieu;
    }

    // Ajoute aussi les setters si besoin
    public void setClimatisee(boolean climatisee) {
        this.climatisee = climatisee;
    }

    public void setChauffage(boolean chauffage) {
        this.chauffage = chauffage;
    }
}

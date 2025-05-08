package tn.dewini.backend.Entities.eve;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Evenement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JsonIgnore // Add this annotation
    @JoinColumn(name = "lieu_id")
    private Lieu lieu;

    private String nom;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime dateDebut;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime dateFin;

    private String description;
    private BigDecimal prix;
    private Integer seuilMinimum;

    @OneToMany(mappedBy = "evenement", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Participation> participations = new ArrayList<>();

    @ManyToOne
    private Salle salle;

    @Embedded
    private coordonnees coordonnees;

    public Salle getSalle() {
        return salle;
    }

    public void setSalle(Salle salle) {
        this.salle = salle;
    }

    public Lieu getLieu() {
        return lieu;
    }

    public void setLieu(Lieu lieu) {
        this.lieu = lieu;
    }

    public Long getId() {
        return id;
    }

    public String getNom() {
        return nom;
    }

    public LocalDateTime getDateDebut() {
        return dateDebut;
    }

    public LocalDateTime getDateFin() {
        return dateFin;
    }

    public String getDescription() {
        return description;
    }

    public BigDecimal getPrix() {
        return prix;
    }

    public Integer getSeuilMinimum() {
        return seuilMinimum;
    }

    public tn.dewini.backend.Entities.eve.coordonnees getCoordonnees() {
        return coordonnees;
    }

    public List<Participation> getParticipations() {
        return participations;
    }

    public void setCoordonnees(tn.dewini.backend.Entities.eve.coordonnees coordonnees) {
        this.coordonnees = coordonnees;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public void setDateDebut(LocalDateTime dateDebut) {
        this.dateDebut = dateDebut;
    }

    public void setDateFin(LocalDateTime dateFin) {
        this.dateFin = dateFin;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setPrix(BigDecimal prix) {
        this.prix = prix;
    }

    public void setSeuilMinimum(Integer seuilMinimum) {
        this.seuilMinimum = seuilMinimum;
    }

    public void setParticipations(List<Participation> participations) {
        this.participations = participations;
    }
}
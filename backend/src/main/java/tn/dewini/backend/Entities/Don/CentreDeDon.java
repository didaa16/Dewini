package tn.dewini.backend.Entities.Don;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "centre_de_don")
public class CentreDeDon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idCentre;
    private String nom;
    private String adresse;
    private String telephone;
    private String codePostal;
    private String email;
    private int capaciteMaximale;
    @Enumerated(EnumType.STRING)
    private Statut statusCentre = Statut.DISPONIBLE; // Valeur par défaut
    public int getIdCentre() {
        return idCentre;
    }
    public void setIdCentre(int idCentre) {
        this.idCentre = idCentre;
    }
    public String getNom() {
        return nom;
    }
    public void setNom(String nom) {
        this.nom = nom;
    }
    public String getAdresse() {
        return adresse;
    }
    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }
    public String getTelephone() {
        return telephone;
    }
    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }
    public String getCodePostal() {
        return codePostal;
    }
    public void setCodePostal(String codePostal) {
        this.codePostal = codePostal;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public int getCapaciteMaximale() {
        return capaciteMaximale;
    }
    public void setCapaciteMaximale(int capaciteMaximale) {
        this.capaciteMaximale = capaciteMaximale;
    }

    public Statut getStatusCentre() {
        return statusCentre;
    }
    public void setStatusCentre(Statut statusCentre) {
        this.statusCentre = statusCentre;
    }
    // Dans CentreDeDon.java
    private int capaciteActuelle = 0; // Nouveau champ
    public boolean peutAccepterPlusDeDons() {
        return this.capaciteActuelle < this.capaciteMaximale;
    }
    public boolean accepteDon(int x) {
        int n = this.capaciteActuelle + x;
        return n <= this.capaciteMaximale;
    }
    public void incrementerCapacite(int nbrParticipants) {
        if (this.capaciteActuelle < this.capaciteMaximale) {
            this.capaciteActuelle+= nbrParticipants;
            if (this.capaciteActuelle >= this.capaciteMaximale) {
                this.statusCentre = Statut.OCCUPE;
            }
        }
    }
    public void decrementerCapacite(int nbrParticipants) {
        if (this.capaciteActuelle > 0) {
            this.capaciteActuelle = this.capaciteActuelle - nbrParticipants;
            if (this.capaciteActuelle < this.capaciteMaximale) {
                this.statusCentre = Statut.DISPONIBLE;
            }
        }
    }
    // Ajoutez le getter/setter pour capaciteActuelle
    public int getCapaciteActuelle() {
        return capaciteActuelle;
    }
    public void setCapaciteActuelle(int capaciteActuelle) {
        this.capaciteActuelle = capaciteActuelle;
    }
}
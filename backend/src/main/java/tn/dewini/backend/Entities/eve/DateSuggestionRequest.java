package tn.dewini.backend.Entities.eve;

import com.fasterxml.jackson.annotation.JsonFormat;

public class DateSuggestionRequest {
    private String nom;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    private String dateDebut;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    private String dateFin;

    private Float prix;
    private int seuilMinimum;

    // Getters and Setters
    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(String dateDebut) {
        this.dateDebut = dateDebut;
    }

    public String getDateFin() {
        return dateFin;
    }

    public void setDateFin(String dateFin) {
        this.dateFin = dateFin;
    }

    public Float getPrix() {
        return prix;
    }

    public void setPrix(Float prix) {
        this.prix = prix;
    }

    public int getSeuilMinimum() {
        return seuilMinimum;
    }

    public void setSeuilMinimum(int seuilMinimum) {
        this.seuilMinimum = seuilMinimum;
    }
}
package tn.dewini.backend.Entities.Consultation;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.util.Date;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import tn.dewini.backend.Entities.User.User;

@Entity
@Data
@Table(name = "consultation")
public class Consultation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_consultation;

    @ManyToOne
    @JoinColumn(name = "id_medecin", referencedColumnName = "id")
    private User medecin;

    @ManyToOne
    @JoinColumn(name = "id_patient", referencedColumnName = "id")
    @NotNull(message = "Le patient ne peut pas être null")
    private User patient;

    @ManyToOne
    @JoinColumn(name = "id_dossier", referencedColumnName = "id_dossier", nullable = false)
    @NotNull(message = "Le dossier médical ne peut pas être null")
    private DossierMedicale dossierMedical;

    @NotNull(message = "La date ne peut pas être null")
    private Date date;

    @NotBlank(message = "L'heure ne peut pas être vide")
    private String heure;

    @Size(max = 500, message = "Le rapport ne doit pas dépasser 500 caractères")
    private String rapport;

    @Size(max = 500, message = "Les recommandations ne doivent pas dépasser 500 caractères")
    private String recommandations;

    public Integer getId_consultation() {
        return id_consultation;
    }

    public void setId_consultation(Integer id_consultation) {
        this.id_consultation = id_consultation;
    }

    public User getMedecin() {
        return medecin;
    }

    public void setMedecin(User medecin) {
        this.medecin = medecin;
    }

    public User getPatient() {
        return patient;
    }

    public void setPatient(User patient) {
        this.patient = patient;
    }

    public DossierMedicale getDossierMedical() {
        return dossierMedical;
    }

    public void setDossierMedical(DossierMedicale dossierMedical) {
        this.dossierMedical = dossierMedical;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getHeure() {
        return heure;
    }

    public void setHeure(String heure) {
        this.heure = heure;
    }

    public String getRapport() {
        return rapport;
    }

    public void setRapport(String rapport) {
        this.rapport = rapport;
    }

    public String getRecommandations() {
        return recommandations;
    }

    public void setRecommandations(String recommandations) {
        this.recommandations = recommandations;
    }

    public Consultation(Integer id_consultation, User medecin, User patient, DossierMedicale dossierMedical, Date date, String heure, String rapport, String recommandations) {
        this.id_consultation = id_consultation;
        this.medecin = medecin;
        this.patient = patient;
        this.dossierMedical = dossierMedical;
        this.date = date;
        this.heure = heure;
        this.rapport = rapport;
        this.recommandations = recommandations;
    }

    public Consultation() {
    }
}
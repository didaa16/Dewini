package tn.dewini.backend.Entities.Rdv;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tn.dewini.backend.Entities.User.User;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Rendezvous {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idRendezvous;

    @ManyToOne
    @JoinColumn(name = "id_patient", nullable = false)
    @NotNull(message = "Le patient ne peut pas être null")
    private User patient;

    @Column(nullable = false)
    private String nomPatient;

    @Column(nullable = false)
    private LocalDate dateNaissance;

    @Column(nullable = false)
    private LocalDate dateRendezvous;

    @Column(nullable = false)
    private String heureRendezvous;
    @Column(nullable = false)
    private String medicalState;


    @Column(name = "email_patient", nullable = false)
    private String emailPatient;

    // Sexe du patient (Homme ou Femme)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SexePatient sexePatient;
    private String title; // Pour le nom affiché dans le calendrier
    private LocalDateTime start; // Fusion date+heure
    private LocalDateTime end;
    @Column(columnDefinition = "boolean default false")
    private boolean reminderSent;
    // Relation un-à-plusieurs avec Reponse
    @OneToMany(mappedBy = "rendezvous", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Reponse> reponses;
    public String getEmailPatient() {
        return emailPatient;
    }
    public String getmedicalState() {
        return medicalState;
    }
    public boolean isReminderSent() {
        return reminderSent;
    }

    public void setReminderSent(boolean reminderSent) {
        this.reminderSent = reminderSent;
    }

    public void setEmailPatient(String emailPatient) {
        this.emailPatient = emailPatient;
    }
    public void setmedicalState(String medicalState) {
        this.medicalState = medicalState;
    }

    // Getters and Setters
    public Long getIdRendezvous() {
        return idRendezvous;
    }

    public void setIdRendezvous(Long idRendezvous) {
        this.idRendezvous = idRendezvous;
    }

    public String getNomPatient() {
        return nomPatient;
    }

    public void setNomPatient(String nomPatient) {
        this.nomPatient = nomPatient;
    }

    public LocalDate getDateNaissance() {
        return dateNaissance;
    }

    public void setDateNaissance(LocalDate dateNaissance) {
        this.dateNaissance = dateNaissance;
    }

    public LocalDate getDateRendezvous() {
        return dateRendezvous;
    }

    public void setDateRendezvous(LocalDate dateRendezvous) {
        this.dateRendezvous = dateRendezvous;
    }

    public String getHeureRendezvous() {
        return heureRendezvous;
    }

    public void setHeureRendezvous(String heureRendezvous) {
        this.heureRendezvous = heureRendezvous;
    }

    public SexePatient getSexePatient() {
        return sexePatient;
    }

    public void setSexePatient(SexePatient sexePatient) {
        this.sexePatient = sexePatient;
    }

    public List<Reponse> getReponses() {
        return reponses;
    }

    public void setReponses(List<Reponse> reponses) {
        this.reponses = reponses;
    }

    // Enumération pour le sexe du patient
    public enum SexePatient {
        HOMME,
        FEMME
    }
    @Override
    public String toString() {
        return String.format(
                "Rendezvous[id=%d, nom=%s, email=%s, date=%s]",
                idRendezvous, nomPatient, emailPatient, dateRendezvous
        );
    }



}

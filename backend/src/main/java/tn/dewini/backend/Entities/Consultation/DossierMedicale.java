package tn.dewini.backend.Entities.Consultation;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.validation.constraints.Size;
import lombok.*;
import tn.dewini.backend.Entities.User.User;

import java.time.LocalDate;

@Entity
@Data
public class DossierMedicale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_dossier;

    @Getter
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_patient", referencedColumnName = "id", nullable = false)
    @NotNull(message = "Le patient ne peut pas être null")
    @JsonManagedReference
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User patient;


    @NotNull(message = "La date de création ne peut pas être null")
    private LocalDate dateCreation;

    @Size(max = 1000, message = "Les antécédents médicaux ne doivent pas dépasser 1000 caractères")
    private String antecedentsMedicaux;

    @Size(max = 1000, message = "Les allergies ne doivent pas dépasser 1000 caractères")
    private String allergies;

    @Size(max = 1000, message = "Les traitements en cours ne doivent pas dépasser 1000 caractères")
    private String traitementsEnCours;

    public void setPatient(User patient) {
        this.patient = patient;
    }
    public User getPatient() {
        return this.patient;
    }
    public String getAntecedentsMedicaux() {
        return antecedentsMedicaux;
    }

    public String getAllergies() {
        return allergies;
    }

    public String getTraitementsEnCours() {
        return traitementsEnCours;
    }





}
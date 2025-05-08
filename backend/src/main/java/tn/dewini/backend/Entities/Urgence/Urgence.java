package tn.dewini.backend.Entities.Urgence;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import tn.dewini.backend.Entities.User.User;

import java.io.Serializable;
import java.util.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "urgence")
public class Urgence implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUrgence;

    @ManyToOne
    @JoinColumn(name = "id_patient", nullable = false)
    @NotNull(message = "Le patient ne peut pas être null")
    private User patient;

    @ManyToOne
    @JoinColumn(name = "id_medecin", nullable = true)
    @Nullable
    private User medecin;

    @NotNull(message = "La date ne peut pas être null")
    private Date date;

    @NotBlank(message = "La description ne peut pas être vide")
    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = true)
    private String addressePatient;

    @NotBlank(message = "La priorité ne peut pas être vide")
    private String priority;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Le type d'urgence ne peut pas être null")
    private TypeUrgence typeUrgence;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Le statut d'urgence ne peut pas être null")
    private StatutUrgence statutUrgence;

    @OneToOne(mappedBy = "urgence", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JsonManagedReference
    private ConsultationUrgente consultationUrgente;

    @NotBlank(message = "La spécialité ne peut pas être vide")
    private String specialite;

}

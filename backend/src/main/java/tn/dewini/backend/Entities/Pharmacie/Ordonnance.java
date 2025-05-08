package tn.dewini.backend.Entities.Pharmacie;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import tn.dewini.backend.Entities.User.User;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
@Entity
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class Ordonnance implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_patient", nullable = false)
    @NotNull(message = "Le patient ne peut pas être null")
    private User patientId;

    @ManyToOne
    @JoinColumn(name = "id_medecin", nullable = false)
    @NotNull(message = "Le médecin ne peut pas être null")
    private User medecinId;

    private LocalDate dateEmission;
    private String instructions;

    @Column(length = 1000)
    private String lienPdf;

    @Column(columnDefinition = "LONGTEXT")
    private String signature; // base64 ou URL de l'image de signature

    @Column(columnDefinition = "TEXT")
    private String commentaire;

    private LocalDate dateAjout; // ✅ Nouveau champ

    @OneToMany(mappedBy = "ordonnance", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Prescription> prescriptions = new ArrayList<>();
}
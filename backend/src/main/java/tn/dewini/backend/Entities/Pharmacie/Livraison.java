package tn.dewini.backend.Entities.Pharmacie;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import tn.dewini.backend.Entities.User.User;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@ToString
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class Livraison implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime dateLivraison;
    private String etat;
    private String nomClient;
    private String adresse;


    @ManyToOne
    @JoinColumn(name = "id_patient", nullable = false)
    @NotNull(message = "Le patient ne peut pas être null")
    private User patientId;

    // 🔁 Relation ManyToMany simple
    @ManyToMany
    @JoinTable(
            name = "livraison_medicaments",
            joinColumns = @JoinColumn(name = "livraison_id"),
            inverseJoinColumns = @JoinColumn(name = "medicament_id")
    )
    private List<Medicament> medicaments = new ArrayList<>();
}



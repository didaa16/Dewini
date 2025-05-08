package tn.dewini.backend.Entities.Pharmacie;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Entity
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class Prescription implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String medicamentNom;
    private String posologie;
    private String duree;

    @ManyToOne
    @JoinColumn(name = "ordonnance_id")
    @JsonBackReference
    private Ordonnance ordonnance;

    // ✅ Remplace par :
    @ManyToOne
    @JoinColumn(name = "medicament_id")
    private Medicament medicament;
}


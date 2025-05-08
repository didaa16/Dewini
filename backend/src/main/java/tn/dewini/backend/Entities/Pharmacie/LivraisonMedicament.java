/*package com.pi.projet.Entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Entities
@Getter
@Setter
@EqualsAndHashCode
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class LivraisonMedicament implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int quantiteCommandee;

    @ManyToOne
    @JoinColumn(name = "livraison_id")
    private Livraison livraison;

    @ManyToOne
    @JoinColumn(name = "medicament_id")
    private Medicament medicament;
}*/


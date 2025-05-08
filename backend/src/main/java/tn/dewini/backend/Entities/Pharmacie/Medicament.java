package tn.dewini.backend.Entities.Pharmacie;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Medicament implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String description;
    private int quantiteEnStock;
    private float prix;
    private String imageUrl;
    private Double promo; // ou Integer promo;

    @Column(nullable = false)
    private String categorie;
    // 🆕 Ajout du champ notes :
    @ElementCollection
    @CollectionTable(name = "medicament_notes")
    @Column(name = "note")
    private List<Integer> notes = new ArrayList<>();


    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateExpiration;

    @ManyToMany(mappedBy = "medicaments")
    @JsonIgnore
    private List<Livraison> livraisons = new ArrayList<>();

    @OneToMany(mappedBy = "medicament", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Prescription> prescriptions = new ArrayList<>();

}





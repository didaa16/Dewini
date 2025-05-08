package tn.dewini.backend.Entities.Don;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@AllArgsConstructor
@Builder
@Table(name = "don")
public class Don {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDon;

    @OneToMany(mappedBy = "don", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<DonDonneur> donneurs = new HashSet<>();


    @ManyToOne
    @JoinColumn(name = "id_centre", nullable = false)
    private CentreDeDon centre;

    @Enumerated(EnumType.STRING)
    private TypeDon typeDon;

    @Enumerated(EnumType.STRING)
    private grpS grpSanguin;

    @Temporal(TemporalType.TIMESTAMP)
    private Date dateDon;


    private String description;

    private Double quantite; // en litres

    // Constructeur par défaut

    public Don() {
        this.donneurs = null;
    }

    // Getters et Setters


    public Set<DonDonneur> getDonneurs() {
        return donneurs;
    }

    public void setDonneurs(Set<DonDonneur> donneurs) {
        this.donneurs = donneurs;
    }

    public Long getIdDon() {
        return idDon;
    }

    public void setIdDon(Long idDon) {
        this.idDon = idDon;
    }

    public CentreDeDon getCentre() {
        return centre;
    }

    public void setCentre(CentreDeDon centre) {
        this.centre = centre;
    }

    public TypeDon getTypeDon() {
        return typeDon;
    }

    public void setTypeDon(TypeDon typeDon) {
        this.typeDon = typeDon;
    }

    public grpS getGrpSanguin() {
        return grpSanguin;
    }

    public void setGrpSanguin(grpS grpSanguin) {
        this.grpSanguin = grpSanguin;
    }

    public Date getDateDon() {
        return dateDon;
    }

    public void setDateDon(Date dateDon) {
        this.dateDon = dateDon;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getQuantite() {
        return quantite;
    }

    public void setQuantite(Double quantite) {
        this.quantite = quantite;
    }
}

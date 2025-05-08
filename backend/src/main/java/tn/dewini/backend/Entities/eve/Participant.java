package tn.dewini.backend.Entities.eve;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import tn.dewini.backend.Entities.User.User;


import java.time.LocalDateTime;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Participant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @NotNull(message = "L'utilisateur ne peut pas être null")
    private User user;


// private Utilisateur utilisateur;

    @ManyToOne
    @JoinColumn(name = "evenement_id", nullable = false)
    private Evenement evenement;

    private LocalDateTime dateEngagement;

    @Enumerated(EnumType.STRING)
    private TypeEngagement typeEngagement;  // Utilisation de l'énumération TypeEngagement

    @Enumerated(EnumType.STRING)
    private RoleEngagement role;  // Utilisation de l'énumération RoleEngagement

    @Enumerated(EnumType.STRING)
    private TypeParticipant type;  // Utilisation de l'énumération TypeParticipant

    // Getters et Setters
    private String qrCode;
    private String badgeUrl;


    public Long getId() {
        return id;
    }

    public String getQrCode() {
        return qrCode;
    }

    public void setQrCode(String qrCode) {
        this.qrCode = qrCode;
    }

    public String getBadgeUrl() {
        return badgeUrl;
    }

    public void setBadgeUrl(String badgeUrl) {
        this.badgeUrl = badgeUrl;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Evenement getEvenement() {
        return evenement;
    }

    public void setEvenement(Evenement evenement) {
        this.evenement = evenement;
    }

    public LocalDateTime getDateEngagement() {
        return dateEngagement;
    }

    public void setDateEngagement(LocalDateTime dateEngagement) {
        this.dateEngagement = dateEngagement;
    }

    public TypeEngagement getTypeEngagement() {
        return typeEngagement;
    }

    public void setTypeEngagement(TypeEngagement typeEngagement) {
        this.typeEngagement = typeEngagement;
    }

    public RoleEngagement getRole() {
        return role;
    }

    public void setRole(RoleEngagement role) {
        this.role = role;
    }

    public TypeParticipant getType() {
        return type;
    }

    public void setType(TypeParticipant type) {
        this.type = type;
    }


}

package tn.dewini.backend.Entities.Don;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import tn.dewini.backend.Entities.User.User;

@Entity
public class DonDonneur {
    @EmbeddedId
    private DonDonneurId id;

    @Enumerated(EnumType.STRING)
    private State state;

    @ManyToOne
    @JsonIgnore
    @MapsId("donId")
    private Don don;

    @ManyToOne
    @MapsId("userId")
    private User User;

    public DonDonneurId getId() {
        return id;
    }

    public void setId(DonDonneurId id) {
        this.id = id;
    }

    public State getState() {
        return state;
    }

    public void setState(State state) {
        this.state = state;
    }

    public Don getDon() {
        return don;
    }

    public void setDon(Don don) {
        this.don = don;
    }

    public User getUser() {
        return User;
    }

    public void setUser(User User) {
        this.User = User;
    }

    @Column(length = 1000) // Pour stocker le QR code (base64 ou texte)
    private String qrCode;

    // ... (autres champs et méthodes existants)

    public String getQrCode() {
        return qrCode;
    }

    public void setQrCode(String qrCode) {
        this.qrCode = qrCode;
    }
}


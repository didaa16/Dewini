package tn.dewini.backend.Entities.eve;

import jakarta.persistence.Embeddable;

@Embeddable
public class coordonnees {
    private double latitude;
    private double longitude ;

    // Constructeurs
    public coordonnees() {}

    public coordonnees(double latitude, double longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    // Getters & Setters
    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }
}

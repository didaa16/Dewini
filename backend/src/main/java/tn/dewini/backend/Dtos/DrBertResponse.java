package tn.dewini.backend.Dtos;

public class DrBertResponse {
    private String label;
    private double score;

    // Getters
    public String getLabel() {
        return label;
    }

    public double getScore() {
        return score;
    }

    // Setters
    public void setLabel(String label) {
        this.label = label;
    }

    public void setScore(double score) {
        this.score = score;
    }
}


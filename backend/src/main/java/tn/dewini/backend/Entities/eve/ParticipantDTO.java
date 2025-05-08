package tn.dewini.backend.Entities.eve;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ParticipantDTO {
    private Long id;
    private Long evenementId;
    private LocalDateTime dateEngagement;
    private RoleEngagement role;
    private TypeEngagement typeEngagement;
    private TypeParticipant type;
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

    public Long getEvenementId() {
        return evenementId;
    }

    public void setEvenementId(Long evenementId) {
        this.evenementId = evenementId;
    }

    public LocalDateTime getDateEngagement() {
        return dateEngagement;
    }

    public void setDateEngagement(LocalDateTime dateEngagement) {
        this.dateEngagement = dateEngagement;
    }

    public RoleEngagement getRole() {
        return role;
    }

    public void setRole(RoleEngagement role) {
        this.role = role;
    }

    public TypeEngagement getTypeEngagement() {
        return typeEngagement;
    }

    public void setTypeEngagement(TypeEngagement typeEngagement) {
        this.typeEngagement = typeEngagement;
    }

    public TypeParticipant getType() {
        return type;
    }

    public void setType(TypeParticipant type) {
        this.type = type;
    }


}

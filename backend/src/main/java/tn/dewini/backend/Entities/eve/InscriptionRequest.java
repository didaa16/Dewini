package tn.dewini.backend.Entities.eve;

import lombok.Data;

@Data
public class InscriptionRequest {
    private Integer userId;  // Add this field
    private Long evenementId;
    private TypeEngagement typeEngagement;
    private RoleEngagement role;
    private TypeParticipant type;

    public Long getEvenementId() {
        return evenementId;
    }

    public void setEvenementId(Long evenementId) {
        this.evenementId = evenementId;
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


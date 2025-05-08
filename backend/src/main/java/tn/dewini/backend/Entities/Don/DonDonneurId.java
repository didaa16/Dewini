package tn.dewini.backend.Entities.Don;

import jakarta.persistence.Embeddable;
import jakarta.persistence.criteria.CriteriaBuilder;

import java.io.Serializable;

@Embeddable
public class DonDonneurId implements Serializable {
    private Long donId;
    private Integer userId;

    public Long getDonId() {
        return donId;
    }

    public void setDonId(Long donId) {
        this.donId = donId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer UserId) {
        this.userId = UserId;
    }
}
